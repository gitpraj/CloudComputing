import boto
import time
from boto.ec2.regioninfo import RegionInfo

region=RegionInfo(name='melbourne', endpoint='nova.rc.nectar.org.au')
ec2_conn = boto.connect_ec2(aws_access_key_id="9425231557814b218a225d0e255ed2a8",
aws_secret_access_key="f92eb48fc005427fa61e26986fdf2433", is_secure=True,
region=region, port=8773, path='/Yservices/Cloud', validate_certs=False)


vms = ['SentimentAnalysis','Web Server','Harvester','Couchdb']

for vm in range(len(vms)):

    reservation = ec2_conn.run_instances('ami-86f4a44c', key_name='tolga_key',instance_type='m2.medium', security_groups=['ssh','HTTP','default'],placement='melbourne-np')

    instance = reservation.instances[0]


    print 'waiting for ' + vms[vm]
    while instance.state != 'running':
        print '.'
        time.sleep(5)
        instance.update()

    print 'done'

    instance.add_tag(instance)


images = ec2_conn.get_all_images()
for img in images:
print 'id: ', img.id, 'name: ', img.name
