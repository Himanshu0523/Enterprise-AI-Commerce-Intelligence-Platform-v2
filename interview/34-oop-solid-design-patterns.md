# 34. Object-Oriented Programming, SOLID & Design Patterns

## 1. Core OOP Concepts
- **Encapsulation**: Bundling state and methods within a class while restricting direct external access to private properties (`#privateField`).
- **Abstraction**: Hiding complex internal implementation details and exposing a simplified public interface.
- **Inheritance**: Subclasses inheriting fields and behaviors from a superclass.
- **Polymorphism**: Ability of different classes to respond to the same interface or method call in their own specific way.
- **Composition vs Aggregation vs Association**:
  - *Composition*: "Has-a" relationship with strict ownership lifecycle (Order owns OrderItems; deleting Order deletes Items).
  - *Aggregation*: "Has-a" relationship without shared lifecycle (Department has Professors; Professors survive Department deletion).
  - *Association*: Loose "Uses-a" relationship between independent objects (Customer uses PaymentGateway).

---

## 2. SOLID Principles Deep Dive
- **S - Single Responsibility Principle (SRP)**: A module/class should have only one reason to change.
- **O - Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification.
- **L - Liskov Substitution Principle (LSP)**: Objects of a superclass should be replaceable with objects of its subclasses without breaking program correctness.
- **I - Interface Segregation Principle (ISP)**: Clients should not be forced to depend upon interfaces they do not use.
- **D - Dependency Inversion Principle (DIP)**: High-level modules should not depend on low-level modules; both should depend on abstractions (Dependency Injection).

---

## 3. GoF Design Patterns & Microservice Mapping
| Pattern | Type | Architecture Mapping & Implementation |
| :--- | :--- | :--- |
| **Strategy** | Behavioral | Swapping Payment Gateways (`StripeStrategy`, `PayPalStrategy`) dynamically based on user selection. |
| **Factory** | Creational | `AgentFactory` instantiates specialized FastAPI AI agents (`PricingAgent`, `InventoryAgent`) dynamically. |
| **Observer** | Behavioral | Kafka Event Bus publishing `ORDER_CREATED` events to multiple independent microservice consumers. |
| **Decorator** | Structural | Express API Gateway middleware wrapping REST routes with authentication and token rate limiting. |
| **Repository** | Structural | Decoupling database queries (`OrderRepository.findActive()`) from domain business logic. |
| **Circuit Breaker** | Resilience | Opossum circuit breaker wrapping external Python FastAPI AI calls to isolate service failures. |
| **Facade** | Structural | API Gateway acting as a single simplified entry point facade over 19 backend microservices. |
