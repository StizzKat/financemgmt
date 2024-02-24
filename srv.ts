import express from 'express';
import { Router, Request, Response} from 'express';
import { get_rec,reg_rec,sanitizer, search} from './functions';
import fs from 'fs';
import bodyParser from 'body-parser';


const server = express();
const router = Router();
const port = 8000
const bp_params = bodyParser.urlencoded({extended:true})
const normalizeslash = (req:any, res:any, next:any) => {
    let originalUrl = req.originalUrl;
    let normalizedUrl = originalUrl.replace(/\/{2,}/g, '/'); // Replace multiple slashes with a single slash
    if (originalUrl !== normalizedUrl) {
        req.url = normalizedUrl; // Update the request URL to the normalized version
    }
  next();

  };
  
server.use(normalizeslash);
server.use(router);

server.use(bodyParser.json());
server.set('view engine','ejs');
server.set('views','./views');
//Essential public assets definitions
var routes = [
    {"url":"/db/info.json","file":"public/db/info.json"},
    {"url":"/js/jquery.js","file":"public/js/jquery.js"},
    {"url":"/js/index.js","file":"public/js/index.js"},
    {"url":"/js/indexhtml.js","file":"public/js/indexhtml.js"},
    {"url":"/css/index.css","file":"public/css/index.css"},
    {"url":"/css/bootstrap.min.css","file":"public/css/bootstrap.min.css"},
    {"url":"/css/bootstrap.min.css.map","file":"public/css/bootstrap.min.css.map"},
];
router.get(['/','/css','/js','/db'],(req,res)=>{
    var titles = "Finance Management";
    res.status(200)
    res.render('index',{title:titles})
});
router.get('/records',(req,res)=>{
    res.header('Content-Type','application/json')
    try{
        //var rr = fs.readFileSync(__dirname+'/db/info.json','utf-8');
        res.send(get_rec()).status(200)
    }catch(e){
        res.json({"status":"Error"}).status(500)
    }
    
    
})
router.post('/records',bp_params,(req,res)=>{
    try{
        var p = JSON.parse(req.body.d)
    }catch(e){
        res.json({"status":"Error"}).status(200)
        return
    }
    var n = sanitizer(p.name)
    var d = sanitizer(p.description)
    var t = sanitizer(p.type)
    var a = sanitizer(p.amount)
    var ai: number = +a
    if(t != "payment" && t != "invoice"){
        res.json({"status":"Error"}).status(200)
        return
    }
    if(Number.isNaN(ai)){
        res.json({"status":"Error"}).status(200)
        return        
    }
    if(reg_rec(n,t,ai,d)){
        res.json({"status":"OK"}).status(200)
    }else{
        res.json({"status":"Error"}).status(200)
        return
    }
})

router.post('/records/s/:search',bp_params,(req,res)=>{
    var s = sanitizer(req.params.search)
    var ps= sanitizer(req.body.search)
    res.header('Content-Type','application/json')
    try{
        var r = search(s,ps)
        res.send(r).status(200)
    }catch(e){
        res.json({"status":"Error"}).status(200)
        return
    }
        
})
//Public assets routing
routes.forEach(r =>{
    router.get(r.url,(req,res)=>{
        res.status(200)
        res.sendFile(r.file,{root:__dirname})
    })
})
router.get('*',(req, res, next)=>{
    res.status(404)
    var title = "404 - Are you lost?"
    res.render('404',{title:title})
});



server.listen(port, ()=>`Server started on port ${port}`);
