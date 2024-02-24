import fs from 'fs'
import {encode} from 'html-entities';

export var get_rec = function(){
    var rr = fs.readFileSync(__dirname+'/db/info.json','utf-8');
    return JSON.parse(rr);
}
export var reg_rec = function($nm: string, $type: string, $amount: number, $details: string){
    interface users {
        names: string;
        type: string;    
        amount: string;
        details: string;
    
    }
    interface formatting{
        [key:string]:users;
    }
    let db: formatting = {}
    var rdb = fs.readFileSync(__dirname+'/db/info.json','utf-8');
    var rdbp = JSON.parse(rdb);
    var keys = Object.keys(rdbp).length
    for(var i=0;i<keys;i++){
    
        db[i] = {
            names:rdbp[i].names,
            type:rdbp[i].type,
            amount:rdbp[i].amount,
            details:rdbp[i].details
        };
       
    }
    db[keys]={
        names:$nm.trim(),
        type:$type,
        amount:String($amount).trim(),
        details:$details.trim()
    }
    
    try{
        fs.writeFileSync(__dirname+'/db/info.json',JSON.stringify(db),{flag:'w'})
        return true
    }catch(e){
        
        return false
    }
}   

export var sanitizer = function($t:any){
    return encode($t);
}

export var search = function($s:string,$ps:string){
    interface searching {
        names: string;
        type: string;    
        amount: string;
        details: string;
    
    }
    interface search_formatting{
        [key:string]:searching;
    }
    let found: search_formatting = {}
    var raw_recs = get_rec()
    var raw_recs_keys = Object.keys(raw_recs).length;
    var search_for = sanitizer($s)
    var term = sanitizer($ps).trim() 
    var reassign_key = -1

    switch(search_for){ //MAKE IT SO IT REQUESTS TYPE AND SEARCH TERM TO DIFFERENT FUNCTIONS
        case 'name':
            for(var i=0;i<raw_recs_keys;i++){
                if(raw_recs[i].names === term){
                    reassign_key++
                    found[reassign_key] = {
                        names:raw_recs[i].names,
                        type:raw_recs[i].type,
                        amount:raw_recs[i].amount,
                        details:raw_recs[i].details
                    };
                }
            }
            return JSON.stringify(found)
        case 'type':
            for(var i=0;i<raw_recs_keys;i++){
                if(raw_recs[i].type === term){
                    reassign_key++
                    found[reassign_key] = {
                        names:raw_recs[i].names,
                        type:raw_recs[i].type,
                        amount:raw_recs[i].amount,
                        details:raw_recs[i].details
                    };
                }
            }
            return JSON.stringify(found)
        case 'amount':
            
            for(var i=0;i<raw_recs_keys;i++){
                
                if(raw_recs[i].amount === term){
                    reassign_key++
                    found[reassign_key] = {
                        names:raw_recs[i].names,
                        type:raw_recs[i].type,
                        amount:raw_recs[i].amount,
                        details:raw_recs[i].details
                    };
                }
                
            }
            return JSON.stringify(found)
    }   
}

module.exports = {
    reg_rec,
    sanitizer,
    search,
    get_rec
}