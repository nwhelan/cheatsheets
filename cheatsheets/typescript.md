# TypeScript Quick Reference

## Basic Types

### Primitive Types
TypeScript's built-in types for basic values and their Python equivalents.

```typescript
let name: string = "hello";        // Python: str
let age: number = 42;              // Python: int or float
let isActive: boolean = true;      // Python: bool
let data: any = "anything";        // Python: Any (typing module)
let nothing: null = null;          // Python: None
let notDefined: undefined;         // Python: None (no direct equivalent)
```

### Arrays
Store multiple values of the same type.

```typescript
let numbers: number[] = [1, 2, 3];           // Python: list[int]
let strings: Array<string> = ["a", "b"];     // Python: list[str]
let mixed: (string | number)[] = [1, "a"];   // Python: list[Union[str, int]]
```

### Tuples
Fixed-length arrays with specific types per position.

```typescript
let point: [number, number] = [10, 20];      // Python: tuple[int, int]
let person: [string, number] = ["Bob", 30];  // Python: tuple[str, int]
let optional: [string, number?] = ["test"];  // Python: tuple[str, int | None]
```

### Objects
Define structure of objects with specific property types.

```typescript
let user: { name: string; age: number } = {  // Python: TypedDict
  name: "Alice",
  age: 25
};

// Optional properties
let config: { host: string; port?: number } = { host: "localhost" };
```

## Advanced Types

### Union Types
Allow multiple types for a single variable.

```typescript
let id: string | number = "123";     // Python: Union[str, int]
let status: "pending" | "done" = "pending";  // Python: Literal["pending", "done"]

function print(value: string | number): void {
  console.log(value);
}
```

### Intersection Types
Combine multiple types into one.

```typescript
type Person = { name: string };
type Employee = { id: number };
type Staff = Person & Employee;      // Python: class inheritance or Protocol

let worker: Staff = { name: "Bob", id: 123 };
```

### Type Aliases
Create reusable type definitions.

```typescript
type UserID = string | number;       // Python: Union[str, int]
type EventHandler = (event: Event) => void;  // Python: Callable[[Event], None]
type Status = "loading" | "success" | "error";  // Python: Literal type
```

### Generics
Create reusable components that work with multiple types.

```typescript
function identity<T>(arg: T): T {    // Python: TypeVar
  return arg;
}

interface Container<T> {             // Python: Generic class
  value: T;
  get(): T;
}

// Built-in generic types
let items: Array<string> = [];       // Python: list[str]
let lookup: Map<string, number>;     // Python: dict[str, int]
let unique: Set<number>;             // Python: set[int]
```

## Collections (Python Equivalents)

### Set Operations
TypeScript Set with Python set equivalents.

```typescript
let mySet = new Set<number>([1, 2, 3]);     // Python: {1, 2, 3} or set([1, 2, 3])

// Common operations
mySet.add(4);                        // Python: my_set.add(4)
mySet.delete(2);                     // Python: my_set.remove(2) or discard(2)
mySet.has(3);                        // Python: 3 in my_set
mySet.size;                          // Python: len(my_set)
mySet.clear();                       // Python: my_set.clear()

// Set operations
let set1 = new Set([1, 2, 3]);
let set2 = new Set([3, 4, 5]);

// Union
let union = new Set([...set1, ...set2]);     // Python: set1 | set2
// Intersection  
let intersection = new Set([...set1].filter(x => set2.has(x))); // Python: set1 & set2
// Difference
let difference = new Set([...set1].filter(x => !set2.has(x)));  // Python: set1 - set2
```

### Map Operations
TypeScript Map with Python dict equivalents.

```typescript
let myMap = new Map<string, number>();       // Python: dict[str, int]

myMap.set("key", 123);               // Python: my_dict["key"] = 123
myMap.get("key");                    // Python: my_dict.get("key")
myMap.has("key");                    // Python: "key" in my_dict
myMap.delete("key");                 // Python: del my_dict["key"]
myMap.size;                          // Python: len(my_dict)

// Iteration
for (let [key, value] of myMap) {    // Python: for key, value in my_dict.items():
  console.log(key, value);
}
```

## Interfaces

### Basic Interface
Define contracts for object structure.

```typescript
interface User {                     // Python: Protocol or TypedDict
  name: string;
  age: number;
  email?: string;  // optional
  readonly id: number;  // immutable
}

function greet(user: User): string {
  return `Hello ${user.name}`;
}
```

### Extending Interfaces
Build complex interfaces from simpler ones.

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {       // Python: class inheritance
  breed: string;
}

// Multiple inheritance
interface Pet extends Animal {
  owner: string;
}

interface ServiceDog extends Dog, Pet {  // Python: multiple inheritance
  service: string;
}
```

### Function Interfaces
Define function signatures.

```typescript
interface Calculator {              // Python: Protocol with __call__
  (x: number, y: number): number;
}

interface EventListener {           // Python: Callable
  (event: Event): void;
}

const add: Calculator = (x, y) => x + y;
```

## Classes

### Basic Class
Object-oriented programming with type safety.

```typescript
class Person {                      // Python: class Person:
  private name: string;             // Python: _name (convention)
  public age: number;               // Python: age (default public)
  protected id: number;             // Python: _id (convention)
  
  constructor(name: string, age: number) {  // Python: def __init__(self, name: str, age: int):
    this.name = name;
    this.age = age;
    this.id = Math.random();
  }
  
  greet(): string {                 // Python: def greet(self) -> str:
    return `Hello, I'm ${this.name}`;
  }
  
  static create(name: string): Person {     // Python: @classmethod
    return new Person(name, 0);
  }
}
```

### Inheritance
Extend classes with additional functionality.

```typescript
class Employee extends Person {     // Python: class Employee(Person):
  private department: string;
  
  constructor(name: string, age: number, dept: string) {
    super(name, age);               // Python: super().__init__(name, age)
    this.department = dept;
  }
  
  getInfo(): string {
    return `${this.greet()} from ${this.department}`;
  }
}
```

### Abstract Classes
Define base classes that cannot be instantiated.

```typescript
abstract class Shape {              // Python: ABC (Abstract Base Class)
  abstract area(): number;          // Python: @abstractmethod
  
  display(): void {                 // Concrete method
    console.log(`Area: ${this.area()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

## Functions

### Function Types
Define function signatures with types.

```typescript
function add(x: number, y: number): number {  // Python: def add(x: int, y: int) -> int:
  return x + y;
}

// Arrow functions
const multiply = (x: number, y: number): number => x * y;

// Optional parameters
function greet(name: string, age?: number): string {  // Python: age: int = None
  return age ? `Hello ${name}, ${age}` : `Hello ${name}`;
}

// Default parameters
function welcome(name: string, greeting: string = "Hello"): string {
  return `${greeting} ${name}`;
}

// Rest parameters
function sum(...numbers: number[]): number {  // Python: def sum(*numbers: int) -> int:
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Function Overloads
Multiple signatures for the same function.

```typescript
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value * 2;
}
```

## Utility Types

### Built-in Utility Types
Transform existing types into new ones.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;    // Python: TypedDict with total=False
type RequiredUser = Required<User>;  // Python: TypedDict with total=True
type UserEmail = Pick<User, "email">; // Extract specific fields
type UserWithoutId = Omit<User, "id">; // Exclude specific fields
type UserKeys = keyof User;          // "id" | "name" | "email" | "age"

// Record type
type Scores = Record<string, number>; // Python: dict[str, int]
type Status = Record<"pending" | "done", boolean>;
```

### Conditional Types
Create types based on conditions.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResponse<T> = T extends string ? { message: T } : { data: T };

// Mapped types
type Optional<T> = {
  [K in keyof T]?: T[K];            // Make all properties optional
};

type Readonly<T> = {
  readonly [K in keyof T]: T[K];    // Make all properties readonly
};
```

## Type Guards

### Built-in Type Guards
Runtime type checking for type safety.

```typescript
function processValue(value: string | number): string {
  if (typeof value === "string") {  // Type guard
    return value.toUpperCase();     // TypeScript knows it's string
  }
  return value.toString();          // TypeScript knows it's number
}

function isArray(value: any): value is any[] {  // Custom type guard
  return Array.isArray(value);
}

// Discriminated unions
interface Bird {
  type: "bird";
  fly(): void;
}

interface Fish {
  type: "fish";
  swim(): void;
}

function move(animal: Bird | Fish): void {
  switch (animal.type) {            // Discriminated union
    case "bird":
      animal.fly();                 // TypeScript knows it's Bird
      break;
    case "fish":
      animal.swim();                // TypeScript knows it's Fish
      break;
  }
}
```

## Modules

### Import/Export
Organize code across files.

```typescript
// Exporting
export const PI = 3.14159;
export function calculate(x: number): number { return x * 2; }
export default class Calculator { }
export { add, subtract } from './math';

// Importing
import Calculator from './calculator';        // Default import
import { PI, calculate } from './utils';     // Named imports
import * as Utils from './utils';            // Namespace import
import type { User } from './types';         // Type-only import
```

### Namespaces
Organize related functionality.

```typescript
namespace Geometry {                // Python: module or package
  export interface Point {
    x: number;
    y: number;
  }
  
  export function distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
}

let point1: Geometry.Point = { x: 0, y: 0 };
```

## Best Practices (2025)

### Strict Configuration
Enable strict mode for better type safety.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Modern Syntax
Use latest TypeScript features for cleaner code.

```typescript
// Satisfies operator (4.9+)
const config = {
  host: "localhost",
  port: 3000
} satisfies Config;

// Template literal types (4.1+)
type HttpMethod = `${"GET" | "POST" | "PUT"}_${"USER" | "ADMIN"}`;

// Const assertions
const colors = ["red", "green", "blue"] as const;  // readonly tuple
type Color = typeof colors[number];  // "red" | "green" | "blue"

// Using operator (5.0+)
class Person {
  name: string;
  age: number;
  constructor(data: { name: string; age: number }) {
    this.name = data.name using "name";  // Disposable pattern
    this.age = data.age;
  }
}
```

### Error Handling
Robust error handling with types.

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await api.getUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await fetchUser("123");
if (result.success) {
  console.log(result.data.name);  // Type-safe access
} else {
  console.error(result.error.message);
}
```

### Performance Tips
Write efficient TypeScript code.

```typescript
// Use const assertions for better inference
const apiEndpoints = {
  users: "/api/users",
  posts: "/api/posts"
} as const;

// Prefer interfaces over types for object shapes
interface UserData {  // Better for extension
  id: number;
  name: string;
}

// Use branded types for validation
type UserId = string & { __brand: "UserId" };
function createUserId(id: string): UserId {
  if (!id || id.length < 3) throw new Error("Invalid ID");
  return id as UserId;
}

// Lazy loading with dynamic imports
const module = await import("./heavy-module");
```