# Python Logging Reference

## Basic Setup

### Quick Start
Simplest way to start logging messages with default configuration.

```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("Application started")
```

### Configure Format
Set custom message format and date format for better readability.

```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
```

### File Logging
Write log messages to a file instead of console output.

```python
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
```

## Log Levels

### Standard Levels
Built-in severity levels from lowest to highest priority.

- `DEBUG`: Detailed diagnostic information (10)
- `INFO`: General information about program execution (20)
- `WARNING`: Something unexpected happened (30)
- `ERROR`: Serious problem occurred (40)
- `CRITICAL`: Very serious error occurred (50)

### Level Usage
```python
logging.debug("Detailed diagnostic info")
logging.info("General information")
logging.warning("Warning message")
logging.error("Error occurred")
logging.critical("Critical error")
```

### Set Level
```python
logging.getLogger().setLevel(logging.DEBUG)
# Only log WARNING and above
logging.getLogger().setLevel(logging.WARNING)
```

## Loggers

### Get Logger
Create named loggers for different modules or components.

```python
logger = logging.getLogger(__name__)
logger = logging.getLogger('myapp.database')
```

### Logger Hierarchy
Loggers form a hierarchy based on their names using dots.

```python
# Parent logger
parent = logging.getLogger('myapp')
# Child logger inherits from parent
child = logging.getLogger('myapp.module')
```

### Logger Methods
```python
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical message")
logger.exception("Error with traceback")
```

## Handlers

### Console Handler
Send log messages to console/terminal output.

```python
handler = logging.StreamHandler()
handler.setLevel(logging.WARNING)
logger.addHandler(handler)
```

### File Handler
Write log messages to a specific file.

```python
handler = logging.FileHandler('app.log')
handler.setLevel(logging.ERROR)
logger.addHandler(handler)
```

### Rotating File Handler
Automatically rotate log files when they reach size limit.

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    'app.log',
    maxBytes=1024*1024,  # 1MB
    backupCount=5
)
```

### Time Rotating Handler
Rotate log files based on time intervals.

```python
from logging.handlers import TimedRotatingFileHandler

handler = TimedRotatingFileHandler(
    'app.log',
    when='midnight',
    interval=1,
    backupCount=7
)
```

## Formatters

### Basic Formatter
Define how log messages should be formatted.

```python
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)
```

### Format Attributes
Common format string attributes for log records.

- `%(asctime)s`: Human-readable time
- `%(name)s`: Logger name
- `%(levelname)s`: Severity level
- `%(message)s`: Log message
- `%(filename)s`: File name
- `%(lineno)d`: Line number
- `%(funcName)s`: Function name
- `%(process)d`: Process ID
- `%(thread)d`: Thread ID

### Custom Formatter
```python
class CustomFormatter(logging.Formatter):
    def format(self, record):
        # Custom formatting logic
        return super().format(record)
```

## Configuration

### Dict Configuration
Configure logging using a dictionary for complex setups.

```python
import logging.config

config = {
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'default',
            'level': 'INFO'
        },
        'file': {
            'class': 'logging.FileHandler',
            'formatter': 'default',
            'filename': 'app.log',
            'level': 'DEBUG'
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['console', 'file']
    }
}

logging.config.dictConfig(config)
```

### File Configuration
Load logging configuration from an external file.

```python
logging.config.fileConfig('logging.conf')
```

### JSON Configuration
```python
import json
import logging.config

with open('logging.json') as f:
    config = json.load(f)
    logging.config.dictConfig(config)
```

## Advanced Usage

### Structured Logging
Add structured data to log messages for better parsing.

```python
import logging
import json

class StructuredFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module
        }
        return json.dumps(log_data)
```

### Context Data
Add contextual information to log messages.

```python
logger.info("User action", extra={
    'user_id': 123,
    'action': 'login',
    'ip_address': '192.168.1.1'
})
```

### Log Filtering
Filter log messages based on custom criteria.

```python
class InfoFilter(logging.Filter):
    def filter(self, record):
        return record.levelno == logging.INFO

handler.addFilter(InfoFilter())
```

### Exception Logging
Capture and log exception tracebacks automatically.

```python
try:
    risky_operation()
except Exception:
    logger.exception("An error occurred")
    # Logs error message with full traceback
```

## Performance Tips

### Lazy Evaluation
Use lazy evaluation for expensive log message construction.

```python
# Good - only evaluated if logged
logger.debug("Processing %s items", len(items))

# Bad - always evaluated
logger.debug(f"Processing {len(items)} items")
```

### Check Level
Check log level before expensive operations.

```python
if logger.isEnabledFor(logging.DEBUG):
    expensive_debug_info = generate_debug_data()
    logger.debug("Debug info: %s", expensive_debug_info)
```

### Disable Logging
Completely disable logging below a certain level.

```python
logging.disable(logging.WARNING)
# Only ERROR and CRITICAL messages will be logged
```

## Testing

### Capture Logs
Capture log messages in tests for verification.

```python
import logging
from unittest.mock import patch

with patch('mymodule.logger') as mock_logger:
    my_function()
    mock_logger.info.assert_called_with("Expected message")
```

### Log Capture
```python
import logging
from io import StringIO

log_capture = StringIO()
handler = logging.StreamHandler(log_capture)
logger.addHandler(handler)

# Run code that logs
my_function()

# Check captured logs
log_output = log_capture.getvalue()
assert "Expected message" in log_output
```

## Common Patterns

### Module Logger
Standard pattern for creating module-level loggers.

```python
import logging

logger = logging.getLogger(__name__)

def my_function():
    logger.info("Function called")
```

### Logger Decorator
Add automatic logging to function calls.

```python
def log_calls(func):
    def wrapper(*args, **kwargs):
        logger.info(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        logger.info(f"Finished {func.__name__}")
        return result
    return wrapper

@log_calls
def my_function():
    pass
```

### Error Handler
Centralized error logging and handling.

```python
def handle_error(error, context=None):
    logger.error(
        "Error occurred: %s",
        str(error),
        extra={'context': context},
        exc_info=True
    )
```

## Best Practices

### Naming Convention
Use hierarchical names that reflect your application structure.

```python
# Good
logger = logging.getLogger('myapp.database')
logger = logging.getLogger('myapp.api.users')

# Avoid
logger = logging.getLogger('db')
logger = logging.getLogger('stuff')
```

### Log Message Guidelines
Write clear, actionable log messages with appropriate levels.

- Use INFO for normal application flow
- Use WARNING for recoverable issues
- Use ERROR for exceptions that affect functionality
- Use DEBUG for detailed diagnostic information

### Security Considerations
Never log sensitive information like passwords or tokens.

```python
# Bad
logger.info(f"User login: {username}:{password}")

# Good
logger.info(f"User login attempt: {username}")
```