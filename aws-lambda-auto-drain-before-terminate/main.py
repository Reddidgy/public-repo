

# outside of lambda


import boto3

event = {'version': '0',
         'id': 'a7db8436-c2d2-5e31-ead6-f75547d08cc4',
         'detail-type': 'EC2 Instance-terminate Lifecycle Action',
         'source': 'aws.autoscaling', 'account': '469415891268',
         'time': '2022-12-06T19:04:16Z', 'region': 'eu-central-1',
         'resources': [
             'arn:aws:autoscaling:eu-central-1:469415891268:autoScalingGroup:8aa0c332-c186-414c-b36a-4419a8034497:autoScalingGroupName/EC2ContainerService-ecs-test-EcsInstanceAsg-I6I5VVQ1WV6P'],
         'detail': {
             'LifecycleActionToken': '6ec140ed-cd48-4886-b67b-b9b63e174a39',
             'AutoScalingGroupName': 'EC2ContainerService-ecs-test-EcsInstanceAsg-I6I5VVQ1WV6P',
             'LifecycleHookName': 'lf-hook', 'EC2InstanceId': 'i-082916171b7ab5475',
             'LifecycleTransition': 'autoscaling:EC2_INSTANCE_TERMINATING',
             'Origin': 'AutoScalingGroup', 'Destination': 'EC2'}}

context = []


##################################
####### STARTING LAMBDA HERE #####
##################################
# and don't forget about imports #
##################################

def lambda_handler(event, context):
    clusters_ids = []
    containerInstanceArns = []
    found_instance_id = False
    OurContainerInstanceArn = ""
    return_message = ""

    to_find_instance_id = event['detail']['EC2InstanceId']
    print(f"Instance to drain: {to_find_instance_id}")

    ecs_client = boto3.client('ecs')
    as_client = boto3.client('autoscaling')
    ec2_client = boto3.client('ec2')
    emr_client = boto3.client('emr')

    clusterArns = ecs_client.list_clusters()['clusterArns']

    print("=== CLUSTERS ===")
    for cluster_arn in clusterArns:
        print(cluster_arn)
        containerInstanceArns = ecs_client.list_container_instances(
            cluster=cluster_arn,
            maxResults=99,
            status='ACTIVE'
            )['containerInstanceArns']
        print("=== INSTANCES ===")
        for InstanceArn in containerInstanceArns:
            containerInstances = ecs_client.describe_container_instances(
                cluster=cluster_arn,
                containerInstances=[
                    InstanceArn,
                    ],
                include=[
                    'TAGS',
                    ]
                )['containerInstances']
            print(InstanceArn)
            print("===")

            print(containerInstances)
            for ContainerInstance in containerInstances:
                ec2InstanceId = ContainerInstance['ec2InstanceId']
                print(ec2InstanceId)
                if to_find_instance_id == ec2InstanceId:
                    OurContainerInstanceArn = ContainerInstance['containerInstanceArn']
                    found_instance_id = True
                    our_cluster_arn = cluster_arn
                else:
                    if not found_instance_id:
                        found_instance_id = False

    if found_instance_id:
        print(f"Starting draining {OurContainerInstanceArn}")
        response = ecs_client.update_container_instances_state(
            cluster=our_cluster_arn,
            containerInstances=[
                OurContainerInstanceArn
            ],
            status='DRAINING'
        )
        return_message = f"Container instance with id {to_find_instance_id} started to drain!"

    else:
        return_message = f"Couldn't fund {to_find_instance_id} container instance to drain"

    # here you can add cloudwatch message

    return return_message


response = lambda_handler(event, context)
print(response)
