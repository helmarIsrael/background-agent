var jx = $.ajax
    function showComments (poster_name, post_id, user_id){  
      var poster = document.getElementById('posterLabel')

      document.getElementById('post_id').value = `${post_id}`
      document.getElementById('user_id').value = `${user_id}`
      
      jx({
        method:'GET',
        url:`/getComments/${post_id}`,
        success:function(response){
            buildComments(response['comments'])
        }
      })
      
      poster.innerHTML = `Comments on ${poster_name}'s Post`
      
    }


    function buildComments(data){
      console.log(data)
      var comment_body = document.getElementById('commentModal-body')
      comment_body.innerHTML = ''
      if (data.length != 0){
        for (var i = 0; i < data.length; i++){
        comment_body.innerHTML += `
                    <div class="card card-inner m-2">
                      <div class="card-body">
                          <div class="row">
                              <div class="col">
                                  <h5><a href="#"><strong>${data[i].commentor}</strong></a></h5>
                                  <small class="text-secondary text-center">${data[i].timestamp}</small>
                                  <p>${data[i].comment}</p>
                              </div>
                          </div>
                      </div>
                    </div>
                  `
        }
      } else {
        comment_body.innerHTML = '<h1>No Comments</h1>'
      }
      
    }
  
  
    function toggleLike(post_id){
      like_btn = document.getElementById(`${post_id}`)

      var request = new XMLHttpRequest()
      

      if (like_btn.classList.contains('like')){
        request.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var data = JSON.parse(request.responseText);
              likes = data['likes']
              document.getElementById(`${post_id}likeCount`).innerHTML = `${likes} Like(s)`
            }
        }
        request.open("GET", '/likePost/'+post_id+'/getDisliked', true )
        request.send()
        like_btn.classList.remove("like")
      } else {
        request.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var data = JSON.parse(request.responseText);
              likes = data['likes']
              document.getElementById(`${post_id}likeCount`).innerHTML = `${likes} Like(s)`
            }
        }
        request.open("GET", '/likePost/'+post_id+'/getLiked', true )
        request.send()
        like_btn.classList.add("like")
      }
    }
  