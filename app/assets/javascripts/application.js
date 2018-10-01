function request(method,url,data,success) {
  csrf_token = document.getElementsByName('csrf-token')[0].content
  xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type','application/json')
  xhr.setRequestHeader('X-CSRF-Token', csrf_token)
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4 && xhr.status === 200) {
      success(JSON.parse(xhr.responseText))
    }
  }
  if(method === 'GET'){
    xhr.send()
  } else {
    xhr.send(JSON.stringify(data))
  }
}

function create(el,ev){
  ev.preventDefault()
  input = document.getElementById('name')
  name  = input.value
  name = name.trim()
  data = {
    task: {
      name: name
    }
  }
  input.value = ''
  request('POST','/tasks',data,function(data){
    row = document.createElement('tr')
    row.classList.add('task')
    html  = ''
    html += "<td class='done'><input type='checkbox' onchange='tasks.done(this,event,"+data.id+")'/></td>"
    html += "<td class='name' contenteditable='true' onkeypress='tasks.update(this,event,"+data.id+")'>"+data.name+"</td>"
    html += "<td class='trash' onclick='tasks.destroy(this,event,"+data.id+")'><span>&mdash;</span>"
    row.innerHTML = html
    tbody = document.getElementById('list')
    tbody.insertBefore(row, tbody.firstElementChild)
  })
  return false
}

function update(el,ev,id){
  if (ev.keyCode === 13){ // enter
    ev.preventDefault()
    name = el.innerHTML
    name = name.trim()
    data = {
      task: {
        name: name
      }
    }
    request('PUT','/tasks/'+id,data,function(){})
  }
}

function destroy(el,ev,id){
  if (confirm("Are you sure you want to delete this task?")) {
    row   = el.parentNode
    tbody = row.parentNode
    tbody.removeChild(row)
    request('DELETE','/tasks/'+id,null,function(){})
  }
}

function done(el,ev,id){
  data = {
    done: el.checked
  }
  row = el.parentNode.parentNode 
  if (el.checked) {
    row.classList.add('done')
  } else {
    row.classList.remove('done')
  }
  request('PUT','/tasks/'+id+'/done',data,function(){})
}


window.tasks = {
  create  : create,
  update  : update,
  destroy : destroy,
  done    : done
}
