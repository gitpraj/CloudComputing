#!/usr/bin/python3
"""genderizer
For finding the gender on the basis of firstname , description and text
"""
from __future__ import division
import math
import gender1 as g
from namesCollection import NamesCollection as n





initialized = False
namesCollection = None
classifier = None


significantDegree = 0.3

surelyMale = 'M'
surelyFemale = 'F'

def detect(firstName=None, text=None, description=None):



    if firstName:
        nameGender = n.getGender(firstName, lang)
        """ If the first name surely is used for only one gender,
            we can accept this gender.Otherwise run SVM classification over 
            description and text
        """

        if nameGender and (nameGender['gender']==surelyMale or nameGender['gender'] == surelyFemale):
            if nameGender['gender'] == surelyMale:
                return 'male'
            elif nameGender['gender'] == surelyFemale:
                return 'female'
        elif description!=None :
            ret=g.checkDescription(description)
            if ret==None and text!=None:
                ret=g.checkTweet(text)
            if(ret!=None) :
               return ret
            else :
               return 'brand'
        else:
           return 'brand'
    else :
         if description!=None :
             ret=g.checkDescription(description)
             if ret==None and text!=None:
                 ret=g.checkTweet(text)
             if(ret!=None) :
                 return ret
             else :
                return 'brand'
         else:
            return 'brand'

