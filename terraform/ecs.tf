# ECR Repository
resource "aws_ecr_repository" "server" {
  name                 = "commercio-server"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Default VPC and Subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group
resource "aws_security_group" "ecs_sg" {
  name        = "commercio-ecs-sg-${random_pet.bucket_suffix.id}"
  description = "Allow inbound traffic on port 5001"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Allow port 5001"
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "commercio-cluster-${random_pet.bucket_suffix.id}"
}

# CloudWatch Log Group for ECS
resource "aws_cloudwatch_log_group" "server_logs" {
  name              = "/ecs/commercio-server-${random_pet.bucket_suffix.id}"
  retention_in_days = 7
}

# ECS Task Execution Role (Using existing LabRole for voclabs environment)
data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "server" {
  family                   = "commercio-server"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "commercio-server"
    image     = "${aws_ecr_repository.server.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 5001
      hostPort      = 5001
      protocol      = "tcp"
    }]
    environment = [
      { name = "NODE_ENV", value = "production" },
      { name = "PORT", value = "5001" },
      { name = "MONGO_URI", value = "mongodb+srv://mannvaswani4_db_user:zDku4hj9RShfHfEP@cluster0.wu9qvee.mongodb.net/?appName=Cluster0" },
      { name = "JWT_SECRET", value = "FU0Q3vn2T0se2A8e" },
      { name = "JWT_REFRESH_SECRET", value = "OUL6NyeOi97y4t7r" },
      { name = "CLIENT_URL", value = "https://commercio-five.vercel.app" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.server_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "server" {
  name            = "commercio-server-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }
}
