


function randomize(posts){
  
    for(let i= 0 ; i<posts.length  ; i++){
          let j = Math.floor( Math.random() * (posts.length-1) );

          let  temp = posts[i]
          posts[i] = posts[j]
          posts[j] = temp ;

    }

    return {posts}
}

module.exports = {randomize}