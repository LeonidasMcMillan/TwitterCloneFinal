

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


function lookup(method, endpoint, callback, data){
    let jsonData;
    if (data){
      jsonData = JSON.stringify(data)
    }
    const xhr = new XMLHttpRequest()
    const url = `http://127.0.0.1:8000/api${endpoint}`
    const responseType = "json"
    xhr.responseType = responseType
    xhr.open(method,url) 
    const csrftoken = getCookie('csrftoken')
    xhr.setRequestHeader("Content-Type", "application/json")
    
    if (csrftoken){
      xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("X-CSRFToken", csrftoken)
    }
    xhr.onload = function() {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function () {
      callback({"message": "The request was an error."}, 400)
    }
    xhr.send(jsonData)
}

export function CreateTweet(newTweet, callback){

  lookup("POST", "/tweets/create-tweet/", callback, {content: newTweet})

}

export function LoadTweets(callback) {

  lookup("GET", "/tweets/", callback )
  
  }
  