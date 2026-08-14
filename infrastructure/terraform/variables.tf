variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS Region"
}

variable "project_name" {
  type        = string
  default     = "enterprise-ai-commerce"
  description = "Project Name identifier"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Execution environment"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "VPC network IP range block"
}

variable "db_username" {
  type        = string
  default     = "admin"
  description = "MySQL database username"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "MySQL database password"
}
