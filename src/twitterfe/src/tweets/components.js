import React, {useEffect, useState} from 'react'
import {LoadTweets, CreateTweet} from '../lookup';


export function TweetsComponent(props){

    const [newTweets, setNewTweets] = useState([])

    const handleSubmit = (event) =>{
        event.preventDefault()
        const newVal = textAreaRef.current.value
        let tempNewTweets = [...newTweets]
        CreateTweet(newVal,(response, status)=>{
          if (status === 201){
              tempNewTweets.unshift(response)
          }
          else {
            alert("An Error has occurred, please try again.")
          }
        })
        
        setNewTweets(tempNewTweets)
        textAreaRef.current.value = ''
    }

    const textAreaRef = React.createRef()

    return <div className ={props.className} >
                <div className= 'col-12 mb-3'>
                    <form onSubmit={handleSubmit}>
                        <textarea ref ={textAreaRef} className = 'form-control' name = 'tweet' required={true}>

                        </textarea>
                        <button type = 'submit' className = 'btn btn-primary my-3'>Tweet</button>
                    </form>
                </div>
            <TweetsList newTweets={newTweets}/>
            </div>
}

export function TweetsList(props) {
    const [tweetsInit, setTweetsInit] = useState([])

    const [tweets, setTweets] = useState([])

    const [tweetDidSet,setTweetsDidSet] = useState(false)


    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit)
        if ( final.length !== tweets.length){
            setTweets(final)
        }
        setTweetsInit()
    },[props.newTweets, tweets, tweetsInit])   
    
    //setTweetsInit([...props.newTweets].concat(tweetsInit))
    useEffect(() => {
      if (tweetsDidSet === false) {
      const myCallback = (response, status) => {
        if (status === 200){
          setTweetsInit(response)
          setTweetsDidSet(true)
        }
        else {
          alert("There was an error.")
        }
      }
  
      LoadTweets(myCallback)
      }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet]
    )
  
    return tweets.map((item, index) => {
      return <Tweet tweet={item} className ='my-5 py-5 border bg-white test-dark' key={`${index}-${item.id}`} />
    })
  }
  
  

export function ActionBtn(props){
    const {tweet, action} = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.like : 0)
    const [justClicked, setJustClicked] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className: 'btn btn-primary btn-small'
    const actionDisplay = action.display ? action.display : "Action"
    
    const handleClick = (event) => {
        event.preventDefault()
        if (action.type === 'like') {
            if (justClicked === true) {
                setLikes(likes-1)
                setJustClicked(false)
            }
            else {
                setLikes(tweet.likes+1)
                setJustClicked(true)
            }
            setLikes(tweet.likes+1)
        }
    }

    const display = action.type ==='like' ? `${tweet.likes} ${actionDisplay}` : actionDisplay

    return <button className={className} onClick={handleClick}>{display}</button> 
}
  
export function Tweet(props) {
    const {tweet} = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return <div className={className}>
      <p>{tweet.id} - {tweet.content}</p>
      <div className='btn btn-group'>
        <ActionBtn tweet={tweet} action={{type: "like", display:"Likes"}}/>
        <ActionBtn tweet={tweet} action={{type: "unlike", display:"Unlike"}}/>
        <ActionBtn tweet={tweet} action={{type: "retweet", display:"Retweet"}}/>
      </div>
       </div>
  }
  