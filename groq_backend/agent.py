from langchain.agents import Tool, AgentExecutor, initialize_agent
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader, TextLoader
from langchain_groq import ChatGroq
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import logging

logger = logging.getLogger(__name__)

class MentalHealthAgent:
    def __init__(self):
        self.llm = self._initialize_llm()
        self.vector_db = self._create_vector_db()
        self.agent = self._setup_agent()

    def _initialize_llm(self):
        try:
            logger.info("Initializing LLM...")
            api_key = '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'
            
            if not api_key:
                raise ValueError("GROQ_API_KEY not found in environment variables")
                
            return ChatGroq(
                temperature=0.7,
                groq_api_key=api_key,
                model_name="llama-3.3-70b-versatile"
            )
        except Exception as e:
            logger.error(f"Error initializing LLM: {str(e)}")
            raise

    def _create_vector_db(self):
        try:
            logger.info("Checking vector database...")
            db_path = "./chroma_db"
            
            if os.path.exists(db_path):
                logger.info("Loading existing vector database")
                embeddings = HuggingFaceBgeEmbeddings(
                    model_name='sentence-transformers/all-MiniLM-L6-v2'
                )
                return Chroma(
                    persist_directory=db_path,
                    embedding_function=embeddings
                )
            
            logger.info("Creating new vector database")
            if not os.path.exists("./bot_data"):
                os.makedirs("./bot_data")
                logger.warning("Created bot_data directory. Please add documents.")
                return None

            pdf_loader = DirectoryLoader("./bot_data/", glob='*.pdf', loader_cls=PyPDFLoader)
            txt_loader = DirectoryLoader("./bot_data/", glob='*.txt', loader_cls=TextLoader)
            
            documents = pdf_loader.load() + txt_loader.load()
            
            if not documents:
                logger.warning("No documents found in bot_data directory")
                return None

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50
            )
            texts = text_splitter.split_documents(documents)
            
            embeddings = HuggingFaceBgeEmbeddings(
                model_name='sentence-transformers/all-MiniLM-L6-v2'
            )
            
            return Chroma.from_documents(
                texts,
                embeddings,
                persist_directory=db_path
            )
            
        except Exception as e:
            logger.error(f"Error with vector database: {str(e)}")
            raise

    def _setup_agent(self):
        try:
            logger.info("Setting up agent...")
            prompt_template = """You are a compassionate mental health support assistant. 
            Your role is to provide empathetic listening and supportive responses.
            Keep a responses to a minimum around 50 to 100 words
            Remember:
            - Maintain a calm, non-judgmental tone
            - Acknowledge and validate feelings
            - Never provide medical advice or diagnosis
            - Encourage professional help when appropriate

            Context: {context}
            
            Human: {question}
            Assistant:"""

            PROMPT = PromptTemplate(
                template=prompt_template,
                input_variables=["context", "question"]
            )

            if self.vector_db:
                retriever = self.vector_db.as_retriever(search_kwargs={"k": 3})
                
                qa_chain = RetrievalQA.from_chain_type(
                    llm=self.llm,
                    chain_type="stuff",
                    retriever=retriever,
                    chain_type_kwargs={
                        "prompt": PROMPT,
                        "document_prompt": PromptTemplate(
                            input_variables=["page_content"],
                            template="{page_content}"
                        )
                    },
                    return_source_documents=True
                )

                # Create a wrapper function that only returns the result part
                def qa_wrapper(question):
                    result = qa_chain({"query": question})
                    # Return only the result part, not the source documents
                    return result["result"]

                qa_tool = Tool(
                    name="Mental Health Knowledge Base",
                    func=qa_wrapper,  # Use the wrapper instead
                    description="Provides mental health support information",
                    return_direct=True
                )
                tools = [qa_tool]
            else:
                tools = []

            return initialize_agent(
                tools=tools,
                llm=self.llm,
                agent="zero-shot-react-description",
                verbose=True,
                handle_parsing_errors=True
            )
        except Exception as e:
            logger.error(f"Error setting up agent: {str(e)}")
            raise

    def get_response(self, user_input):
        try:
            # Get the full output from the agent
            full_output = self.agent({"input": user_input})
            
            # Extract just the text response
            if isinstance(full_output, dict) and 'output' in full_output:
                return full_output['output']
            elif isinstance(full_output, str):
                return full_output
            else:
                logger.error(f"Unexpected agent output format: {type(full_output)}")
                return "I'm having trouble formulating a response. Please try again."
                
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I apologize, but I'm having trouble responding right now. Please try again."