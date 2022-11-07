import cloudinary
import cloudinary.uploader
import cloudinary.api
import sys
from model import spcall
#from mega import Mega

"""
cloud_name = "myeskwelaedu",
api_key = "147859526676822",
api_secret = "mKjJSetE-yx7hxlNX9Vbnux0NTg"

Google Drive
Client ID: 134719642929-9qvvrc1k7ss0iokvscu96ffhv8gstoql.apps.googleusercontent.com
Cliend Secret: eHyUl85mtXq2ORFyNXydd5r8

OneDrive appsecret: kkHT9];wkskkYDLNF3511}|
Appid : 0274ed53-772a-4889-a7b6-c576eb0519b3
app namm: My Python App

Mega Storage: 7xKrVC1okz8WrkFyFz3afA
username: orven.llantos@gmail.com
password: iKHqXruyyW

"""

class megaServer:
    def __init__(self):
        mega = Mega()
        self.m = mega.login('orven.llantos@gmail.com', '3ZeyucxJsW')

    def upload(self, par_file):
        try:
            file = self.m.upload(par_file)
            link = self.m.get_upload_link(file)
            #do something
            return {"status": "ok", "file": link}#,"result": result}

        except:
            return {"status":"error", "message":str(sys.exc_info()[0]) +
                " " + str(sys.exc_info()[1])}

    def getFile(self, par_fileurl):
        file = self.m.download_url(par_fileurl, 'uploads/')
        return file


class fileServer:
    def __init__(self):
        cloudinary.config(
            cloud_name = "myeskwela",
            api_key = "194739911629951",
            api_secret="BI9aqoHU-j2rYP-a-FFAl6cs_wk"
        )

    def upload(self, file, par_personid):
        try:
            result = cloudinary.uploader.upload(
                file,
                public_id=par_personid,
                crop='limit',
                width=150,
                height=200,
                eager = [{
                    'width':200, 'height':200,
                    'crop':'thumb', 'gravity':'face',
                    'radius': 20, 'format':'jpg'
                }],
                tags=['for_homepage']
            )

            return {"status": "ok","result": result}

        except:
            return {"status":"error", "message":str(sys.exc_info()[0]) +
                " " + str(sys.exc_info()[1])}


    def getImage(self,  par_personid):
        return '<img src="' + spcall("getcloudinaryurl", (par_personid,))[0][0] +'" />'

    def getImageUrl(self, par_personid):
        return  spcall("getcloudinaryurl", (par_personid,))[0][0]


            #cloudinary.CloudinaryImage(par_personid + ".jpg")\
            #.image(alt = "User Image")
        # '<img src=' +\
        #       "'http://res.cloudinary.com/demo/image/upload/v1/" + par_personid + ".jpg' />"

    def getImgSrcUrl(self, par_cloudinaryurl):
        return '<img src="' + par_cloudinaryurl +'" />'


