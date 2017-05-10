import os
import sys
import numpy as np
import pandas as pd
from SentenceTokeniser import SentenceTokeniser
import couchdb
from CouchDBConnect import CouchDBConnect
import core
import h5py
import pickle
import Sentiment_twitter as S
import genderizer

# first, build index mapping words in the embeddings set
# to their embedding vector

_db_handle=CouchDBConnect.connect_CouchDB()
db = _db_handle["tweets"]

def get_text(db):
    queue = {}
    try:


        for row in db.view('aflteams/forgender',
                                 wrapper=None,
                                 group='False'
                                 ):
                queue.update({row.key[0]: {}})
                queue[row.key[0]]['rev'] = row.key[1]
                queue[row.key[0]]['text'] = row.key[2]
    except:
        raise Exception("Failed to retrieve view: "
            + db.name
            + "/tweets2/_view/forSenti\n\n")
    return queue
def iterate_doc(db):

    if(True):
        replies = get_text(db)
        for r in replies:
            if(True):
                doc = db.get(r)
                if('gender' not in doc) :
                    print(r)
                    if('text' in doc) :
                       text = doc['text']
                    else :
                       text=None
                    doc1=doc['user']
                    if('description' in doc1) :
                       description = doc['user']['description']
                    else :
                       description=None
                    if('name' in doc1 and doc['user']['name']!="") :
                       name= doc['user']['name'].split()
                       firstName = name[0]
                       print("firstname : ",firstName,r )
                    else :
                       firstName=None
                    description=doc['user']['description']
                    gender=genderizer.detect(firstName,text,description)
                    print("Gender:  ",gender)
                    doc['gender']=gender
                    doc = db.save(doc)
                    # print (doc['_id'], doc['_rev'])
                    print ("Saved")
            # except:
            #     print("Exception1")
            #     pass
    # except:
    #     print("Exception2")
    #     pass
def main():
  print
  _db_handle=CouchDBConnect.connect_CouchDB()
  db = _db_handle["tweets"]
  iterate_doc(db)


if __name__ == "__main__":
    main()
