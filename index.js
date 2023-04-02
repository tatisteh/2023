const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

//in browser "localhost:3000/...""
app.get('/', (req, res) => {
  res.send('Hello World...');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).sent('The course with the given ID was not found');
  //if we do have a course with a give id then
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); // result.error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

//rout handler
app.put('/api/courses/:id', (req,res) => {
  //look up the course
  //if not existind, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).sent('The course with the given ID was not found');

  //validate
  //if invalid, return 404
  const { error } = validateCourse(req.body); // result.error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //update course
  course.name = req.body.name;
  //return the updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))
