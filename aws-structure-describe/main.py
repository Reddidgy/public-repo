import boto3

from aws_structure_functions import *
from config import *

if ec2_check:
    print("Describe EC2")
    # Initialize the EC2 client
    ec2 = boto3.client('ec2', region_name=AWS_REGION)

    # Describe EC2 instances
    response = ec2.describe_instances()
    counter = 1
    try:
        Output_Data("A1", "EC2")

    # Loop through the reservations (groups of instances)
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            instance_id = instance["InstanceId"]
            print(f"Describing instance {instance_id}")
            formatted_sg_rules_arr = []
            counter += 1

            # Initialize vpc_id variable
            vpc_id = None

            # Get the VPC ID if it exists
            if 'VpcId' in instance:
                vpc_id = instance['VpcId']

                # Get the CIDR block of the VPC if VPC ID is available
                if vpc_id:
                    vpc_response = ec2.describe_vpcs(VpcIds=[vpc_id])
                    if 'Vpcs' in vpc_response and len(vpc_response['Vpcs']) > 0:
                        cidr_block = vpc_response['Vpcs'][0]['CidrBlock']
                    else:
                        cidr_block = 'N/A'
                else:
                    cidr_block = 'N/A'
            else:
                vpc_id = 'N/A'
                cidr_block = 'N/A'

            if vpc_id != 'N/A':
                if vpc_id not in vpcs:
                    vpcs.append(vpc_id)
                    cidrs.append(cidr_block)

            # Get the instance name (if it exists)
            instance_name = None
            for tag in instance.get('Tags', []):
                if tag['Key'] == 'Name':
                    instance_name = tag['Value']

            # Get the SSH key name (if it exists)
            ssh_key_name = instance.get('KeyName', 'N/A')
            output_var = ""

            # SG preparation
            if sg_check:
                # Get security groups associated with the instance
                security_group_ids = [sg['GroupId'] for sg in instance.get('SecurityGroups', [])]

                for sg_id in security_group_ids:
                    sg = ec2.describe_security_groups(GroupIds=[sg_id])['SecurityGroups'][0]

                    inbound_sg_rules = sg['IpPermissions']

                    formatted_sg_rules_arr = []
                    for rule in inbound_sg_rules:
                        if "ToPort" in rule.keys():
                            tmp_port = rule["ToPort"]
                        else:
                            tmp_port = "All ports"
                        if rule["IpRanges"]:
                            formatted_rule = {tmp_port: Cidr_Reformat(rule["IpRanges"])}
                            formatted_sg_rules_arr.append(formatted_rule)

                    instance_sgs_exist = False

                # The array used to print SG regarding EC2
                sg_rules_formatted_array.append({instance_id: formatted_sg_rules_arr})

            if instance_name:
                output_var += f"{instance_name}\n"
            output_var += f"Instance ID: {instance['InstanceId']}\n"
            output_var += f"Instance Type: {instance['InstanceType']}\n"
            output_var += f"Public IP: {instance.get('PublicIpAddress', 'N/A')}\n"
            output_var += f"Private IP: {instance['PrivateIpAddress']}\n"
            output_var += f"State: {instance['State']['Name']}\n"
            output_var += f"VPC ID: {vpc_id}\n"
            output_var += f"CIDR: {cidr_block}\n"
            output_var += f"SSH Key: {ssh_key_name}\n"
            output_var += f"Purpose: "

            # wks.update(f"A{str(counter)}", output_var)
            Output_Data(f"A{str(counter)}", output_var)

if sg_check:
    print("Describe SG")
    counter = 1
    Output_Data("B1", "EC2 Security Groups")

    for instance_object in sg_rules_formatted_array:
        counter += 1
        output_var = ""
        for instance_id, rules_array in instance_object.items():
            print(f"Describing SG for instance {instance_id}")
            output_var += f"{instance_id} sg\n"
            for rule in rules_array:
                output_var += f"{Sg_Rule_Reformat(rule)}\n"
        Output_Data(f"B{str(counter)}", output_var)

if vpc_check:
    print("Describe VPC")
    counter = 1
    Output_Data("E1", "VPC")

    for vpc_index in range(0, len(vpcs)):
        vpc_id = vpcs[vpc_index]
        print(f"Describing VPC {vpc_id}")
        output_var = ""
        counter += 1
        output_var += f"VPC ID: {vpc_id}\n"
        output_var += f"CIDR: {cidrs[vpc_index]}"
        # wks.update(f"E{str(counter)}", output_var)
        Output_Data(f"E{str(counter)}", output_var)

if ecs_check:
    print("Describe ECS")
    # Initialize the ECS client
    ecs = boto3.client('ecs', region_name=AWS_REGION)

    # Describe ECS clusters
    response = ecs.list_clusters()
    counter = 1
    Output_Data("C1", "ECS")

    # Loop through the ECS cluster ARNs
    for cluster_arn in response['clusterArns']:
        counter += 1

        # Describe the cluster to get more details
        cluster_description = ecs.describe_clusters(clusters=[cluster_arn])

        if 'clusters' in cluster_description and len(cluster_description['clusters']) > 0:
            cluster_details = cluster_description['clusters'][0]

            # Get the cluster name
            cluster_name = cluster_details['clusterName']
            print(f"Describing ECS {cluster_name}")

            # Get running tasks count
            running_tasks_count = cluster_details['runningTasksCount']

            # Get the status of the cluster
            cluster_status = cluster_details['status']

            # Print cluster details
            output_var = f"{cluster_name}\n"
            output_var += f"Status: {cluster_status}\n"
            output_var += f"Running tasks: {running_tasks_count}\n"

            Output_Data(f"C{str(counter)}", output_var)
            # wks.update()

if elb_check:
    print("Describe ELB")
    # Initialize the ELB client
    elb = boto3.client('elbv2', region_name=AWS_REGION)

    # Describe ELBs
    response = elb.describe_load_balancers()
    counter = 1
    Output_Data("D1", "Load Balancers")

    # Loop through the ELBs
    for load_balancer in response['LoadBalancers']:
        counter += 1

        # Get the load balancer name
        load_balancer_name = load_balancer['LoadBalancerName']
        print(f"Describing LB {load_balancer_name}")

        # Get the load balancer DNS name
        dns_name = load_balancer['DNSName']

        # Get the load balancer scheme (internet-facing or internal)
        scheme = load_balancer['Scheme']

        # Get the load balancer VPC ID
        vpc_id = load_balancer['VpcId']

        # Print load balancer details
        output_var = f"{load_balancer_name}\n"
        output_var += f"DNS: {dns_name}\n"
        output_var += f"Scheme: {scheme}\n"
        output_var += f"VPC ID: {vpc_id}\n"

        # wks.update(f"D{str(counter)}", output_var)
        Output_Data(f"D{str(counter)}", output_var)
