var getresults = function(){
    url = "/records"
    msgs(0,0)
    $.ajax({
        url:url,
        type:"GET",
        success: function(d){
            var l = Object.keys(d).length
            if(l == 0){

                msgs(0,1)
            }
            if(l > 0){
                results = ""
                for(i=0;i<l;i++){
                    var name = JSON.parse(JSON.stringify(d))[i]['names']
                    var type = JSON.parse(JSON.stringify(d))[i]['type']
                    var amount = JSON.parse(JSON.stringify(d))[i]['amount']
                    var details = JSON.parse(JSON.stringify(d))[i]['details']
                    if(i == 0){
                        results += `<span class="record-${i} record-results">${name}'s ${type} for ${details} is \$${amount}</span>`
                    }else{
                        results += `<span class="record-${i} record-results recs">${name}'s ${type} for ${details} is \$${amount}</span>`
                    }                 
                    
                }
                $('.records').html(results)
            }
            
            
        },
        error:function(){

            msgs(0,2)
            return
        }
    })
}
var sendRecord = function(n,t,d,a){
   
    record_data = {
        name:n,
        type:t,
        description:d,
        amount:a
    }
    record_data = JSON.stringify(record_data)
    $.ajax({
        type:"POST",
        url:"/records",
        dataType:"json",
        data:{
            d:record_data
        },
        success: function(d){
            getresults()
        },
        error:function(){

            msgs(0,3)
            setTimeout(()=>{
                getresults()
            },4000)
            return
        }
            
    })
}

var search = function(type, term){
    $.ajax({
        type:"POST",
        url:"/records/s/"+type,
        data:{search:term},
        success:function(d){
            l = Object.keys(d).length
            $('.search-form').css('border-bottom','none')
            $('.search-form').css('border-bottom-left-radius','0px')
            $('.search-form').css('border-bottom-right-radius','0px')
            $('.search-form').css('height','45px')
            $('hr').css('display','block')
            $('.search-result').css('display','block')
            if(l == 0){

                msgs(1,1)
            }
            if(l > 0){
                search_results = ""
                console.log(d)
                for(i=0;i<l;i++){
                    var name = JSON.parse(JSON.stringify(d))[i]['names']
                    var type = JSON.parse(JSON.stringify(d))[i]['type']
                    var amount = JSON.parse(JSON.stringify(d))[i]['amount']
                    var details = JSON.parse(JSON.stringify(d))[i]['details']
                    if(i == 0){
                        search_results += `<span class="record-${i} record-results">${name}'s ${type} for ${details} is \$${amount}</span>`
                    }else{
                        search_results += `<span class="record-${i} record-results recs">${name}'s ${type} for ${details} is \$${amount}</span>`
                    } 
                }
                $('.search-result').html(search_results)
            }

        }
    })
}
var btn_inputs = function(type){
    $(`.sb-${type}-input`).ready(()=>{
        $(`.sb-${type}-input`).on('keydown',(e)=>{
            if(e.keyCode == 13){
                search(type,$(`.sb-${type}-input`).val())
            }
        })  
    
    })
}
$(document).ready(()=>{
    getresults()
    $('.name, .description, .amount').on('keydown',(e)=>{
        if(e.keyCode == 13){
            var name = $('.name').val()
            var type = $('.type').val()
            var description = $('.description').val()
            var amount = $('.amount').val() 
            sendRecord(name,type,description,amount)
        }
    })
    $('.sub-btn').on('click',()=>{
        var name = $('.name').val()
        var type = $('.type').val()
        var description = $('.description').val()
        var amount = $('.amount').val() 
        sendRecord(name,type,description,amount)
    })
    $('.sb-name, .sb-type, .sb-amount').on('click',(e)=>{
        
        btn_name = `sb-${$(e.target).val().toLowerCase()}`

        
        if(btn_name == "sb-name"){
            $('.sb-inputs').html('<div class="separator"></div><input class="sb-name-input" type="text" placeholder="Name"><input class="sb-sub-btn name-btn" type="submit" value="Submit">')
        }
        if(btn_name == "sb-type"){
            $('.sb-inputs').html('<div class="separator"></div><select class="sb-type-input"><option>Select type</option><option value="payment">Payment</option><option value="invoice">Invoice</option></select><input class="sb-sub-btn type-btn" type="submit" value="Submit">')
            
        }
        if(btn_name == "sb-amount"){
            $('.sb-inputs').html('<div class="separator"></div><input class="sb-amount-input" type="text" placeholder="Amount"><input class="sb-sub-btn amount-btn" type="submit" value="Submit">')
        }
        btn_inputs($(e.target).val().toLowerCase())

        $('.sb-sub-btn').on('click',()=>{
            search($(e.target).val().toLowerCase(),$(`.sb-${$(e.target).val().toLowerCase()}-input`).val())
        })
    })
     
    
    
})
