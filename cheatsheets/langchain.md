# LangChain Quick Reference

## Installation & Setup

### Install Core Packages
Get started with LangChain by installing the essential libraries.
```bash
pip install langchain langchain-core langchain-community
pip install langgraph  # For agents and stateful apps
pip install langchain-openai  # For OpenAI integration
```

### Basic LLM Setup
Initialize a chat model to start building LLM-powered applications.
```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7,
    max_tokens=150
)
```

### Environment Variables
Configure API credentials for third-party LLM providers.
```python
import os
os.environ["OPENAI_API_KEY"] = "your-api-key"
```

## Chat Models

### Send Messages
Communicate with the LLM using structured message objects for conversations.
```python
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

messages = [
    SystemMessage(content="You are a helpful assistant"),
    HumanMessage(content="Tell me a joke")
]

response = llm.invoke(messages)
print(response.content)
```

### Streaming Response
Display responses in real-time as they're generated for better UX.
```python
for chunk in llm.stream(messages):
    print(chunk.content, end="", flush=True)
```

### Batch Requests
Process multiple prompts efficiently in a single API call.
```python
responses = llm.batch([
    [HumanMessage(content="What is 2+2?")],
    [HumanMessage(content="What is 3+3?")]
])
```

## LCEL (LangChain Expression Language)

### Basic Chain
Create sequential processing pipelines using the pipe operator.
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "Translate to {language}"),
    ("user", "{text}")
])

chain = prompt | llm | StrOutputParser()

result = chain.invoke({
    "language": "French",
    "text": "Hello world"
})
```

### Parallel Execution
Run multiple operations concurrently and combine results.
```python
from langchain_core.runnables import RunnableParallel

chain = RunnableParallel({
    "translation": prompt | llm,
    "summary": summary_prompt | llm
})

result = chain.invoke({"text": "..."})
```

### Runnable Lambda
Apply custom transformation functions within your chain pipelines.
```python
from langchain_core.runnables import RunnableLambda

def transform(x):
    return x.upper()

chain = RunnableLambda(transform) | llm
```

### Async Invocation
Handle high-concurrency workloads with async support for chains.
```python
result = await chain.ainvoke({"text": "..."})

# Async streaming
async for chunk in chain.astream({"text": "..."}):
    print(chunk)
```

## Prompt Templates

### Chat Prompt Template
Create reusable prompt templates with dynamic variable substitution.
```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant"),
    ("user", "Tell me about {topic}")
])

formatted = prompt.invoke({"topic": "Python"})
```

### String Prompt Template
Build simple text-based prompts for non-chat models.
```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template(
    "What is a good name for a company that makes {product}?"
)

formatted = prompt.invoke({"product": "socks"})
```

### Few-Shot Prompts
Provide examples to guide the model's responses.
```python
from langchain_core.prompts import FewShotChatMessagePromptTemplate

examples = [
    {"input": "2 + 2", "output": "4"},
    {"input": "2 + 3", "output": "5"}
]

example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
    ("ai", "{output}")
])

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=example_prompt,
    examples=examples
)

final_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a math wizard"),
    few_shot_prompt,
    ("human", "{input}")
])
```

### Dynamic Few-Shot with Similarity
Automatically select the most relevant examples based on input similarity.
```python
from langchain_core.example_selectors import SemanticSimilarityExampleSelector

example_selector = SemanticSimilarityExampleSelector(
    vectorstore=vectorstore,
    k=2  # Select 2 most similar examples
)

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_selector=example_selector,
    example_prompt=example_prompt
)
```

## RAG (Retrieval Augmented Generation)

### Document Loading
Load documents from various sources like web pages, files, or databases.
```python
from langchain_community.document_loaders import WebBaseLoader
import bs4

loader = WebBaseLoader(
    web_paths=("https://example.com/article",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title")
        )
    )
)
docs = loader.load()
```

### Text Splitting
Break large documents into smaller chunks for better retrieval.
```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
splits = text_splitter.split_documents(docs)
```

### Embeddings & Vector Store
Convert text to embeddings and store them for semantic search.
```python
from langchain_openai import OpenAIEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = InMemoryVectorStore(embeddings)

# Add documents
document_ids = vectorstore.add_documents(documents=splits)
```

### Retrieval
Find the most relevant documents using semantic similarity search.
```python
# Similarity search
results = vectorstore.similarity_search(
    "What is the main topic?",
    k=4  # Return top 4 results
)

# With scores
results = vectorstore.similarity_search_with_score("query")
```

### RAG Chain
Combine retrieval and generation to answer questions using your documents.
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

template = """Answer based on the context:

Context: {context}

Question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {
        "context": vectorstore.as_retriever() | format_docs,
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("What is...?")
```

## Tools & Function Calling

### Define Tools
Create custom tools that LLMs can call to perform specific actions.
```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two numbers together."""
    return a * b

@tool
def search(query: str) -> str:
    """Search the web for information."""
    return f"Results for: {query}"

tools = [multiply, search]
```

### Bind Tools to Model
Enable the LLM to automatically call tools based on user input.
```python
llm_with_tools = llm.bind_tools(tools)

response = llm_with_tools.invoke([
    HumanMessage(content="What is 3 times 4?")
])

# Check for tool calls
if response.tool_calls:
    print(response.tool_calls)
```

### Structured Output
Force the LLM to return responses in a specific JSON schema format.
```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str = Field(description="Person's name")
    age: int = Field(description="Person's age")
    email: str = Field(description="Email address")

structured_llm = llm.with_structured_output(Person)

result = structured_llm.invoke("John is 30 years old, email john@example.com")
print(result.name, result.age)
```

## Agents (Using LangGraph)

### Create ReAct Agent
Build agents that can reason and use tools iteratively.
```python
from langgraph.prebuilt import create_react_agent

@tool
def get_weather(city: str) -> str:
    """Get the weather for a city."""
    return f"It's sunny in {city}"

agent = create_react_agent(
    model=llm,
    tools=[get_weather],
)

response = agent.invoke({
    "messages": [{"role": "user", "content": "What's the weather in SF?"}]
})
```

### Agent with State
Build complex workflows with custom state management and control flow.
```python
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict, Annotated
from typing import List

class State(TypedDict):
    messages: Annotated[List, "append"]
    context: str

def retrieve(state: State):
    # Retrieval logic
    docs = vectorstore.similarity_search(state["messages"][-1])
    return {"context": format_docs(docs)}

def generate(state: State):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Build graph
graph = StateGraph(State)
graph.add_node("retrieve", retrieve)
graph.add_node("generate", generate)
graph.add_edge(START, "retrieve")
graph.add_edge("retrieve", "generate")
graph.add_edge("generate", END)

app = graph.compile()
```

## Memory & Chat History

### Message History
Maintain conversation context across multiple turns for chatbot applications.
```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history"
)

response = chain_with_history.invoke(
    {"input": "Hi, I'm Alice"},
    config={"configurable": {"session_id": "user123"}}
)
```

### Conversation Buffer Memory
Store and retrieve complete conversation history for legacy chain implementations.
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    return_messages=True,
    memory_key="chat_history"
)

memory.save_context(
    {"input": "Hi"},
    {"output": "Hello! How can I help?"}
)

history = memory.load_memory_variables({})
```

## Output Parsers

### String Output Parser
Extract plain text content from LLM message responses.
```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()
chain = prompt | llm | parser
```

### JSON Output Parser
Parse LLM responses into JSON dictionaries automatically.
```python
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()
chain = prompt | llm | parser
```

### Pydantic Output Parser
Validate and parse LLM output into strongly-typed Pydantic models.
```python
from langchain_core.output_parsers import PydanticOutputParser

class Response(BaseModel):
    answer: str
    confidence: float

parser = PydanticOutputParser(pydantic_object=Response)
chain = prompt | llm | parser
```

### List Output Parser
Convert comma-separated text into Python lists automatically.
```python
from langchain_core.output_parsers import CommaSeparatedListOutputParser

parser = CommaSeparatedListOutputParser()
# Parses "red, blue, green" into ["red", "blue", "green"]
```

## Vector Stores

### Popular Vector Stores
Store embeddings in production-ready databases with persistence support.
```python
# Chroma
from langchain_community.vectorstores import Chroma

vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# FAISS
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(splits, embeddings)
vectorstore.save_local("faiss_index")

# Load existing
vectorstore = FAISS.load_local("faiss_index", embeddings)
```

### Retriever
Configure search strategies for optimal document retrieval in RAG applications.
```python
# Convert to retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

docs = retriever.invoke("query")

# MMR (Maximum Marginal Relevance) - diverse results
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 20}
)
```

## Document Loaders

### Text Files
Load plain text files into LangChain document format.
```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("file.txt")
docs = loader.load()
```

### PDF
Extract text and metadata from PDF documents for processing.
```python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("document.pdf")
pages = loader.load_and_split()
```

### CSV
Import tabular data from CSV files as documents.
```python
from langchain_community.document_loaders import CSVLoader

loader = CSVLoader("data.csv")
docs = loader.load()
```

### Web Pages
Scrape and load content from web pages.
```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://example.com")
docs = loader.load()
```

### Directory
Batch load all files from a directory matching a pattern.
```python
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader("./docs", glob="**/*.txt")
docs = loader.load()
```

## Callbacks & Debugging

### Streaming Callbacks
Print LLM output to console in real-time as it's generated.
```python
from langchain_core.callbacks import StreamingStdOutCallbackHandler

llm = ChatOpenAI(
    callbacks=[StreamingStdOutCallbackHandler()],
    streaming=True
)
```

### Debug Mode
Enable verbose logging to troubleshoot chain execution issues.
```python
import langchain
langchain.debug = True

# Now all chains will print detailed execution info
```

### Custom Callbacks
Track LLM calls and responses with custom logging or metrics.
```python
from langchain_core.callbacks import BaseCallbackHandler

class MyCallback(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"LLM started with prompts: {prompts}")

    def on_llm_end(self, response, **kwargs):
        print(f"LLM finished with response: {response}")

llm = ChatOpenAI(callbacks=[MyCallback()])
```

## Common Patterns

### Conditional Routing
Route inputs to different chains based on content or conditions.
```python
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: "code" in x, code_chain),
    (lambda x: "math" in x, math_chain),
    general_chain  # default
)
```

### Fallbacks
Automatically switch to backup LLMs when primary provider fails.
```python
from langchain_core.runnables import RunnableWithFallbacks

chain = primary_llm.with_fallbacks([backup_llm])
```

### Retry
Add automatic retry logic with exponential backoff for reliability.
```python
from langchain_core.runnables import RunnableRetry

chain = chain.with_retry(
    stop_after_attempt=3,
    wait_exponential_jitter=True
)
```

## Tips & Best Practices

- Use `InMemoryVectorStore` for prototyping, switch to persistent stores for production
- Enable streaming for better UX with long responses
- Use LangGraph for complex agents with state management and cycles
- Leverage LCEL's async support for handling concurrent requests
- Monitor with LangSmith for production observability
- Keep chunk sizes between 500-2000 chars for RAG applications
- Use `RecursiveCharacterTextSplitter` for most text splitting needs
- Prefer LangGraph's `create_react_agent` over legacy agent implementations
