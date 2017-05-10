key_dir='./'
key = ec2_conn.create_key_pair('CCC2017-Team8')
key.save(key_dir)
