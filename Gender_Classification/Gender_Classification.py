#!/usr/bin/python3
"""Gender_Classification

For  classifying the twitter user based gender using name,description and text
"""
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
import genderizer

# first, build index mapping words in the embeddings set
# to their embedding vector

_db_handle=CouchDBConnect.connect_CouchDB()
db = _db_handle["tweets_all"]

def get_text(db):
"""Function to get id's from view otherSports in tweets_all
"""
    queue = {}
    try:
        for row in db.view('sport/otherSports',
                                 wrapper=None,
                                 group='False'
                                 ):
                queue.update({row.key[0]: {}})
                queue[row.key[0]]['text'] = row.key[1]
                queue[row.key[0]]['sport'] = row.key[2]
    except:
        raise Exception("Failed to retrieve view: "
            + db.name
            + "/sport/_view/otherSports\n\n")
    return queue
def iterate_doc(db):
"""Function to  iterate through each tweet to do gender classification for 
   user
"""
    try:
        replies = get_text(db)
        for r in replies:
            try:
                doc = db.get(r)
                if('gender' not in doc) :
                    if('text' in doc) :
                       text = doc['text']
                    else :
                       text=None
                    doc1=doc['user']
                    if('description' in doc1) :
                       description = doc['user']['description']
                    else :
                       description=None
                    if('name' in doc1) :
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
                    print ("Saved")
            except:
                print("Exception1")
                pass
    except:
        print("Exception2")
        pass
def main():
  print
  _db_handle=CouchDBConnect.connect_CouchDB()
  db = _db_handle["tweets_all"]
  iterate_doc(db)


if __name__ == "__main__":
    main()
