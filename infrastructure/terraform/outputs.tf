output "eks_cluster_name" {
  value       = module.eks.cluster_name
  description = "Name of the EKS Kubernetes Cluster"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "API Endpoint for EKS Cluster Control Plane"
}

output "database_endpoint" {
  value       = aws_db_instance.mysql_warehouse.endpoint
  description = "Endpoint address of the RDS MySQL database"
}
