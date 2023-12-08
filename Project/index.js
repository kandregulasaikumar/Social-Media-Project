
import express from 'express';
import hbs from 'hbs';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


import { readPosts, readUser,insertUser , insertPosts, likefun, sharefun , deleteFun} from './operation.js';
const app = express();

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // Correct usage of cookie-parser middleware


app.get('/', (req, res) => {
  res.render('login');
});


app.post('/login', async (req, res) => {
  const output = await readUser(req.body.profile);
  const password = output[0].password;

  if (password === req.body.password) {
    const secretKey = '1b180';
    const payload = { profile: output[0].profile, name: output[0].name, headline: output[0].headline };
    const token = jwt.sign(payload, secretKey);
    console.log(token);
    res.cookie('token', token);
    res.redirect('/posts');
  } else {
    res.send('Incorrect Username or password');
  }
});

//post
app.get('/posts', verifeyLogin, async (req, res) => {
  const output = await readPosts();
  res.render("posts", {
    data: output,
    userInfo: req.payload
  });
});

app.post('/likes', async(req,res)=>{
  await likefun (req.body.content)
  res.redirect('/posts')
})

app.post('/shares', async(req,res)=>{``
  await sharefun (req.body.content)
  res.redirect('/posts')
})


app.post('/addposts', async (req, res) => {
  await insertPosts(req.body.profile, req.body.content)
  res.redirect('/posts')
})


app.post('/delete', async (req, res) => {
  await deleteFun(req.body.content)
  res.redirect('/posts')
})



function verifeyLogin(req, res, next) {
  const secretKey = '1b180';
  const token = req.cookies.token; // Corrected syntax
  jwt.verify(token, secretKey, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.payload = payload;
    next();
  });
}


///regisster function

app.get('/register', (req, res) => {
  res.render("register")

})




app.post('/addusers',async (req, res) => {
  if (req.body.password === req.body.cnfpassword) 

  {
    await insertUser( req.body.name, req.body.profile, req.body.headline, req.body.password)

    res.redirect('/')
  }

  else {
    res.send("password and confirm Password did not match")

  }

 
})


app.listen(3000, () => {
  console.log('The server has started.....');
});
