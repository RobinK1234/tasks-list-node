const express = require('express')
const app = express()
const port = 3002

// add template engine
const path = require('path')
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

//static files - CSS, JS, Images
app.use(express.static(path.join(__dirname, 'public')))

// use file system - read and write files
const fs = require('fs')


app.get('/', (req, res) => {
    fs.readFile('./tasks.json', 'utf-8', (err, jsonString) => {
        if(err){
            console.log('Error reading file: ', err)
            return
        }
        try {
            // li inside html is tasksData
            const tasks = JSON.parse(jsonString)
            res.render('index', {tasksData : tasks})
            console.log(tasks)
        } catch (err) {
            console.log('Error parsing JSON file: ', err)
        }
    })
})

app.get('/delete-task/:taskId', (req,res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    fs.readFile('./tasks.json', 'utf-8', (err, jsonString) => {
        if(err){
            console.log('Error reading file: ', err)
            return
        }
        try {
            // li inside html is tasksData
            const tasks = JSON.parse(jsonString)
            tasks.forEach((task, index) => {
                if(task.id === deletedTaskId){
                    tasks.splice(index, 1)
                }
            })
            jsonString = JSON.stringify(tasks, null, 2)
            fs.writeFile('./tasks.json', jsonString, 'utf-8', (err) => {
                if(err){
                    console.log('Error writing file: ', err)
                } else {
                    console.log('Data is saved to file')
                }
            })
            res.redirect('/')
        } catch (err) {
            console.log('Error parsing JSON file: ', err)
        }
    })
})

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.post('/add-task', (req, res) => {
    let userTask = req.body.user_task
    fs.readFile('./tasks.json', 'utf-8', (err, jsonString) => {
        if(err){
            console.log('Error reading file: ', err)
            return
        }
        try {
            const tasks = JSON.parse(jsonString)
            let index
            if(tasks.length === 0)
            {
                index = 0
            } else {
                index = tasks[tasks.length-1].id + 1;
            }

            const newTask = {
                "id" : index,
                "task" : userTask
            }

            tasks.push(newTask)
            jsonString = JSON.stringify(tasks, null, 2)
            fs.writeFile('./tasks.json', jsonString, 'utf-8', (err) => {
                if(err) {
                    console.log('Error writing file: ', err)
                } else {
                    console.log('Data is saved to file')
                }
            })
            res.redirect('/')
        } catch (err) {
            console.log('Error parsing JSON file: ', err)
        }
    })
})

app.get('/delete-all/', (req, res) => {
    fs.writeFile('./tasks.json', JSON.stringify([]), err =>{
        if(err){
            console.log('Error deleting files')
        } else {
            console.log('Deleted all files')
        }
    })
    res.redirect('/')
})

app.listen(3002)