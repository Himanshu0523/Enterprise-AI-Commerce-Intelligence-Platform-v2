# 39. Cloud AWS Architecture & Infrastructure Design

## 1. Cloud Network Security Architecture (VPC & Subnets)
```
AWS Region ──► VPC (10.0.0.0/16)
               ├── Public Subnets (ALB / Ingress Gateway) ──► Internet Gateway
               └── Private Subnets (Microservices + DBs)  ──► NAT Gateway
```
- **VPC (Virtual Private Cloud)**: Isolated virtual network in AWS cloud.
- **Public Subnet**: Connected directly to Internet Gateway (IGW). Hosts AWS Application Load Balancers (ALB) and public ingress proxies.
- **Private Subnet**: No direct Internet ingress. Hosts microservice containers (ECS/EKS), MongoDB replica nodes, and Redis clusters.
- **NAT Gateway**: Enables private subnet microservices outbound Internet egress (e.g., calling 3rd-party Stripe APIs) while blocking inbound Internet connections.
- **Security Groups vs Network ACLs**:
  - *Security Group*: Stateful firewall operating at the instance/container level.
  - *Network ACL*: Stateless firewall operating at the subnet boundary level.

---

## 2. Core AWS Infrastructure Mapping
| Capability | AWS Managed Service | Project Implementation |
| :--- | :--- | :--- |
| **Compute** | AWS ECS / EKS | Container orchestration running Docker microservices. |
| **Storage** | AWS S3 / S3 Glacier | Object storage for product media assets and long-term DB backups. |
| **Database** | MongoDB Atlas / AWS ElastiCache | Managed NoSQL document DB & in-memory Redis cluster. |
| **CDN** | AWS CloudFront | Edge caching for static storefront assets and Next.js static pages. |
| **DNS & Routing** | Route 53 | DNS resolution & active-passive multi-region failover. |
| **Secrets & IAM** | AWS Secrets Manager & IAM | Secret encryption at rest and Principle of Least Privilege access. |
