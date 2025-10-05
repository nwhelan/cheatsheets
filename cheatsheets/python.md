# Python Quick Reference

## Data Types

### Strings
- Creation: `str = "hello"` or `str = 'world'`
- Multi-line: `"""triple quotes"""`
- F-strings: `f"Hello {name}"`
- Methods: `.upper()`, `.lower()`, `.strip()`, `.split()`, `.join()`
- Slicing: `str[start:end:step]`

### Numbers
- Integer: `x = 42`
- Float: `y = 3.14`
- Complex: `z = 3 + 4j`
- Operations: `+`, `-`, `*`, `/`, `//`, `%`, `**`

### Lists
- Creation: `lst = [1, 2, 3]`
- Append: `lst.append(4)`
- Extend: `lst.extend([5, 6])`
- Insert: `lst.insert(0, 'first')`
- Remove: `lst.remove(value)`, `lst.pop(index)`
- Comprehension: `[x**2 for x in range(10)]`

### Dictionaries
- Creation: `d = {'key': 'value'}`
- Access: `d['key']` or `d.get('key', default)`
- Methods: `.keys()`, `.values()`, `.items()`
- Update: `d.update({'new': 'item'})`
- Comprehension: `{k: v for k, v in items}`

### Sets
- Creation: `s = {1, 2, 3}` or `set([1, 2, 3])`
- Add: `s.add(4)`
- Remove: `s.remove(item)`, `s.discard(item)`
- Operations: `s1 | s2` (union), `s1 & s2` (intersection), `s1 - s2` (difference)

### Tuples
- Creation: `t = (1, 2, 3)` or `t = 1, 2, 3`
- Immutable sequence
- Unpacking: `a, b, c = t`

## Control Flow

### Conditionals
```python
if condition:
    # code
elif other_condition:
    # code
else:
    # code
```

### Ternary Operator
```python
result = value_if_true if condition else value_if_false
```

### Loops - For
```python
for item in iterable:
    # code

for i, item in enumerate(iterable):
    # code with index

for key, value in dict.items():
    # code
```

### Loops - While
```python
while condition:
    # code
    if break_condition:
        break
    if skip_condition:
        continue
```

### Match (Python 3.10+)
```python
match value:
    case pattern1:
        # code
    case pattern2:
        # code
    case _:
        # default
```

## Functions

### Definition
```python
def function_name(param1, param2='default'):
    """Docstring"""
    return result
```

### Lambda
```python
lambda x: x * 2
lambda x, y: x + y
```

### Args and Kwargs
```python
def func(*args, **kwargs):
    # args is tuple
    # kwargs is dict
```

### Decorators
```python
@decorator
def function():
    pass

# Common decorators
@staticmethod
@classmethod
@property
```

## Classes

### Basic Class
```python
class MyClass:
    def __init__(self, param):
        self.param = param

    def method(self):
        return self.param
```

### Inheritance
```python
class Child(Parent):
    def __init__(self, param):
        super().__init__(param)
```

### Magic Methods
- `__init__`: Constructor
- `__str__`: String representation
- `__repr__`: Developer representation
- `__len__`: Length
- `__getitem__`: Index access
- `__call__`: Make instance callable

## File Operations

### Reading
```python
with open('file.txt', 'r') as f:
    content = f.read()
    # or f.readline()
    # or f.readlines()
```

### Writing
```python
with open('file.txt', 'w') as f:
    f.write('content')
    # or f.writelines(lines)
```

### Modes
- `'r'`: Read (default)
- `'w'`: Write (overwrite)
- `'a'`: Append
- `'r+'`: Read and write
- `'b'`: Binary mode

## Error Handling

### Try-Except
```python
try:
    # risky code
except ValueError as e:
    # handle specific error
except (TypeError, KeyError):
    # handle multiple errors
except Exception as e:
    # catch all
else:
    # runs if no exception
finally:
    # always runs
```

### Raising Exceptions
```python
raise ValueError("Error message")
raise TypeError(f"Invalid type: {type(obj)}")
```

## Common Built-ins

### Iteration
- `range(start, stop, step)`
- `enumerate(iterable, start=0)`
- `zip(iter1, iter2, ...)`
- `map(function, iterable)`
- `filter(function, iterable)`

### Type Conversion
- `int()`, `float()`, `str()`
- `list()`, `tuple()`, `set()`, `dict()`
- `bool()`

### Utility
- `len(obj)`: Length
- `type(obj)`: Type
- `isinstance(obj, type)`: Type check
- `sorted(iterable)`: Sort
- `reversed(iterable)`: Reverse
- `sum(iterable)`: Sum
- `min(iterable)`, `max(iterable)`
- `all(iterable)`, `any(iterable)`

## List Comprehensions

### Basic
```python
[x for x in range(10)]
[x**2 for x in range(10)]
```

### With Condition
```python
[x for x in range(10) if x % 2 == 0]
```

### Nested
```python
[x*y for x in range(3) for y in range(3)]
```

### Dict/Set Comprehensions
```python
{x: x**2 for x in range(5)}
{x for x in range(10) if x % 2 == 0}
```

## Modules

### Import
```python
import module
import module as alias
from module import function
from module import *
```

### Common Modules
- `os`: Operating system
- `sys`: System-specific
- `json`: JSON handling
- `re`: Regular expressions
- `datetime`: Date/time
- `random`: Random numbers
- `math`: Math functions
- `collections`: Data structures
- `itertools`: Iterator tools

## String Formatting

### F-strings (3.6+)
```python
f"Hello {name}"
f"Value: {value:.2f}"
f"{value:10}"  # width
f"{value:>10}"  # right align
```

### Format Method
```python
"Hello {}".format(name)
"x={0}, y={1}".format(x, y)
"{name}, {age}".format(name="Bob", age=30)
```

### % Formatting
```python
"Hello %s" % name
"x=%d, y=%.2f" % (x, y)
```

## Context Managers

### With Statement
```python
with open('file.txt') as f:
    # file automatically closed
```

### Custom Context Manager
```python
class MyContext:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # cleanup
        pass
```

## Generators

### Generator Function
```python
def gen():
    yield 1
    yield 2
    yield 3
```

### Generator Expression
```python
(x**2 for x in range(10))
```

## Type Hints (3.5+)

```python
def greet(name: str) -> str:
    return f"Hello {name}"

from typing import List, Dict, Optional, Union

def process(items: List[int]) -> Dict[str, int]:
    pass

Optional[str]  # str or None
Union[int, str]  # int or str
```
