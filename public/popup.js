//Creating Input Elements to take in domain
const createElements = ()=>{
  const p = document.createElement("p")
  const input = document. createElement("input"); 
  const i = document. createElement("i"); 
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Add Domain');
  
  i.classList.add("fa","fa-window-close")
  i.addEventListener("click",function(){
    deleteDomain(this)
    
  })
  

  p.appendChild(input)
  p.appendChild(i) 
  return p
}

//checking if domain filter is on/off
const domain = document.getElementById("domain")
const hidden = document.getElementById("hidden")

//saving Domain List
const saveDomainList = (arr,txt)=>{
  let success = document.getElementById("success")
  chrome.storage.sync.set({ "domainList":arr }, (savedObj) => { 
    console.log(arr)
    if(arr.length == 0){
      unfilter()
    }
    else{
      console.log("Saved Domains")
      chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"}).then((res)=>{
        console.log(res)
      }).catch((err)=>console.log(err));
    } 
    success.innerText = txt
    success.style.color  = "lightseagreen" 
    success.style.display = "block"
    setTimeout(()=>{
      success.style.display = "none"
    },3000)
    })
}

//LRU without filtering
const unfilter = ()=>{
  hidden.style.display = "none"
  domain.checked = false
  chrome.storage.sync.set({ "checkbox":false }, () => { 
    console.log("unchecked")
    chrome.storage.sync.set({ "domainList": [] }, () => { 
      console.log("Emptied Domains")
      const li = hidden.getElementsByTagName("p")
      console.log(li)
      const x = li.length
      for(j=x-1;j>=0;j--){
        console.log(li[j])
        li[j].remove()
      }
      chrome.storage.local.set({"lru":{}}, function() { 
        console.log("LRU List Emptied")
        chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"}).then((res)=>{
          console.log(res)
        }).catch((err)=>console.log(err));
      })
    })
})
}

//delete domain
const deleteDomain = (crossTag)=>{
  chrome.storage.local.get("lru",async(items)=>{
    var allKeys = Object.keys(items.lru);
    let domainli = await getDomainList()
    const obj = items.lru
    console.log(items.lru.size)
    const removedDomainLink = crossTag.parentNode.firstElementChild.value
    let filteredDomainLi = domainli.filter(e=>e!=removedDomainLink)
    console.log(filteredDomainLi)
    saveDomainList(filteredDomainLi,"* Deleted Successfully")
    for(let j=0;j<allKeys.length;j++){
      if(allKeys[j].includes(removedDomainLink))
      {
        console.log("in i tag",obj[allKeys[j]])
        delete obj[allKeys[j]]
      }    
    }
    chrome.storage.local.set({"lru":obj}, function(returnedObj) { 
      console.log("LRU Changed",returnedObj)
      
    })
    crossTag.parentNode.remove()
    
    allKeys = []
  })
}

const domainCheck = ()=>{
  if(domain.checked){
    hidden.style.display = "block"
    chrome.storage.sync.set({ "checkbox":true }, () => { 
        console.log("checked")
        chrome.storage.sync.set({ "domainList": [] }, () => { })
    })
  }
  else{
    unfilter()
  }


}

chrome.storage.sync.get("checkbox", (obj) => { 
  if(obj){
    if(obj.checkbox){
      hidden.style.display = "block"
      domain.checked = true
      chrome.storage.sync.get("domainList", (obj) => { 
        console.log("Domainlist",obj)
        if(obj){
          if(obj.domainList){
            hidden.firstElementChild.remove()
            for(j=0;j<obj.domainList.length;j++){
              if(obj.domainList[j] != ""){
                console.log("asdsda",obj.domainList[j] )
                const p = createElements()
                p.firstChild.setAttribute('value', obj.domainList[j]); 
                hidden.insertBefore(p,filterBtns)
            }
            }
          }
        }
      })
    }
    else{
      hidden.style.display = "none"
      domain.checked = false
    }
  }
})

domain.addEventListener("click",()=>{
    domainCheck()
})

//for the first p tag(first domain)
document.getElementsByTagName("i")[0].addEventListener("click",function(){
    deleteDomain(this)
  })
//for adding remaining p tags(remaining domains)  
const addBtn = document.getElementById("addBtn")
const filterBtns = document.getElementById("filterBtns")
addBtn.addEventListener("click",()=>{
  const p = createElements() 
  hidden.insertBefore(p,filterBtns)
})

// for validating domains
const validateDomain = (domainName)=>{
  if(domainName.length == 4 && domainName[0]=='https:' && domainName[1]=="" && domainName[2]!="" && domainName[3]==""){
    return true
  }
  return false
}

const check = (x)=>{
  return new Promise((resolve,reject)=>{
    chrome.storage.sync.get("domainList", (obj) => { 
      if(obj && obj.domainList){
        if(obj.domainList.includes(x)){
          resolve(false)
        }
        else{
          resolve(true)
        }
      }
    })
  })
             
}

//returns the domainList
const getDomainList = ()=>{
  return new Promise((resolve,reject)=>{
    chrome.storage.sync.get("domainList", (obj) => { 
      resolve(obj.domainList)
    })
  })
             
}

//checks if arrays are equal or not
const equalsFn = (a, b) =>
  a.length === b.length &&
  a.every((v, i) => v === b[i]);

//for saving Domains
const saveBtn = document.getElementById("saveBtn")
  saveBtn.addEventListener("click",()=>{
    chrome.storage.local.get("lru",async(items)=>{
    let li = hidden.getElementsByTagName("input")
    const arr = []
    const temp = await getDomainList()
    let objItems = items.lru
    let flag = -1
    for(i=0;i<li.length;i++){
      if(li[i]){
      if(li[i].value != ""){
        let x = li[i].value.split("/")
        var allKeys = Object.keys(objItems);
        if(validateDomain(x)){
          let t = await check(li[i].value) 
          console.log(t)
          if(t){
          console.log(li[i].value)
            
            const removedDomainLink = li[i].value
            for(let j=0;j<allKeys.length;j++){
              if(!allKeys[j].includes(removedDomainLink))
              {
                console.log(temp)
                
                if(!temp.some((e)=>allKeys[j].includes(e))){
                  console.log("in i tag",objItems[allKeys[j]])
                  delete objItems[allKeys[j]]
                }

              }    
            }
            // allKeys = []
          }

          arr.push(li[i].value)
        }
        else{
          flag= i+1
          break
        }
      }
    }
    }
    
    chrome.storage.local.set({"lru":objItems}, function(returnedObj) { 
      console.log("LRU List Emptied",returnedObj)
      
    })
    let success = document.getElementById("success")
    if(flag>-1){
      success.innerText = "Domain: "+flag+" is Incorrect!"
      success.style.color  = "#DF4D55" 
      success.style.display = "block"
      setTimeout(()=>{
        success.style.display = "none"
      },3000)
    }  
    else{
      chrome.storage.sync.get("domainList", (obj) => { 
        console.log("Domainlist",obj)
        if(obj){
          if(obj.domainList){
              if(!equalsFn(obj.domainList,arr))
                saveDomainList(arr,"* Saved Successfully")
              }
            }
          })
    }
  })
  })
  

const btnId = document.getElementById("btnId")
chrome.storage.sync.get("set",(obj)=>{
  
  console.log(obj)
  if(obj.set)
  {
    // btnId.classList.remove("btn-danger")
    // btnId.classList.add("btn-success")

    btnId.style.backgroundColor = "#5ab95a "
  }
  else{
    // btnId.classList.add("btn-danger")
    // btnId.classList.remove("btn-success")
    btnId.style.backgroundColor = "#c74747"
  }
})

//SET LRU Button
btnId.addEventListener("click",()=>{
  chrome.storage.sync.get("set",(obj)=>{
    if(obj.set){
      chrome.storage.sync.set({ "set":false }, () => { 
        btnId.style.backgroundColor = "#c74747"
        // btnId.classList.add("btn-danger")
        // btnId.classList.remove("btn-success")
        chrome.storage.local.set({"lru":{}}, function() { 
          console.log("LRU List Emptied")
          // chrome.runtime.sendMessage({type:"FROM_POPUP_FALSE"});
        })
        
      })
    }
    else{
        chrome.storage.sync.set({ "set":true }, () => {
          // btnId.classList.remove("btn-danger")
          // btnId.classList.add("btn-success") 
          btnId.style.backgroundColor = "#5ab95a "
          chrome.runtime.sendMessage({type:"FROM_CONTENT_TRUE"}).then((res)=>{
            console.log(res)
          }).catch((err)=>console.log(err));
        })
    }

  })
  })
  

