const urlModel = require("../model/model");
const shortId =require("shortid")
const validUrl = require('valid-url')
const axios= require("axios")
const {SETEX_ASYN,GET_ASYNC} = require("../cache")
//*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*--Create Url--*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#**#*#*#*#*#

const creatUrl= async function (req,res){
    try{
        let data =req.body
      
        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't create data with empty body"})
  
        if(typeof(data.longUrl)!=="string"){return res.status(400).send({status:false,msg:"please provide url in string formate"})}

        if(!validUrl.isUri(data.longUrl.trim())){return res.status(400).send({status:false,msg:"please provide valid url"})}

//===========================================================searching data in cache===========================================================

        let Db_data = await GET_ASYNC(`${req.body.longUrl.trim() }`)
        let cacheurl = JSON.parse(Db_data)
        if(cacheurl){return res.status(200).send({status:true,msg:"Data comming from cache",data:{longUrl:cacheurl.longUrl, shortUrl:cacheurl.shortUrl,urlCode:cacheurl.urlCode}})}

//===================================================searching longurl in Db and setting it in cache============================================

        let olddata=await UrlModel.findOne({longUrl:data.longUrl}).select({"urlCode":1,"longUrl":1,"shortUrl":1,"_id":0})
        if(olddata){
                await SETEX_ASYNC(`${olddata.longUrl}`, JSON.stringify(olddata))
                return res.status(200).send({status:true,msg:"Data already exist in Db",data:olddata})}


//====================================================checking link exist in real life or not==================================================

        let validUrlchk=await axios.get(data.longUrl.trim())
        .then(()=>data.longUrl)
        .catch(()=>null)

        if(!validUrlchk){return res.status(404).send({status:false,msg: `Error! Link Not Found ${data.longUrl.trim()}`})}
 //=============================================================short-id generate==============================================================

        let url=shortId.generate().toLowerCase()
        let baseUrl="http://localhost:3000/"
        data.shortUrl=baseUrl+url
        data.urlCode=url
//=====================================================unique-urlCode=========================================================================

        // let old_id=await UrlModel.findOne({urlCode:url})
        // if(old_id){return res.status(200).send({status:false,msg:"This urlcode already exist try again "})}
          
//=============================================================creating new link data==========================================================
        let createdata= await UrlModel.create(data)
        return res.status(201).send({status:true,msg:"Data created successfully",data:{longUrl:createdata.longUrl, shortUrl:createdata.shortUrl,urlCode:createdata.urlCode}})

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}
//*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*--Get Url--*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#**#*#*#*#*#*#


const geturl= async function(req,res){
 try{
let url=req.params.urlCode
//===========================================================searching data in cache==========================================================

let getLongUrl = await GET_ASYNC(`${req.params.urlCode}`)
let cacheurl =JSON.parse(getLongUrl)
if(cacheurl){return res.status(302).redirect(cacheurl.longUrl)}

//===================================================searching data in Db and storing in cache================================================

let LongUrl=await UrlModel.findOne({urlCode:url}).select({longUrl:1,_id:0})
if(!LongUrl){return res.status(404).send({status:false,msg:"can't find any data with this urlcode"})}  
await SETEX_ASYNC(`${req.params.urlCode}`, 86400, JSON.stringify(LongUrl))
res.status(302).redirect(LongUrl.longUrl)
}catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}
module.exports={creatUrl,geturl}