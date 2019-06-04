const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser= express.json()
const languageRouter = express.Router()

languageRouter
  .use(requireAuth) 
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'), 
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })


languageRouter
  .get('/head', async (req, res, next) => {
    const db = req.app.get('db');
    const userId = req.user.id;

    let head = await LanguageService.getLanguageHead(
      db,
      userId,
    )
    let totalScore = await LanguageService.getTotalScore(
      db,
      userId
    );

    head = head[0];
    totalScore = totalScore[0];

    const headWord = {
      nextWord: head.original,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count,
      totalScore: Number(totalScore.total_score)
  }
    return res.status(200).json(headWord);
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    let guess = req.body.guess

    const db = req.app.get('db');
    const languageId = req.language.id;
    const userId = req.user.id;

    try {
      if (!guess) {     
        return res.status(400).send({error: `Missing 'guess' in request body`});
      }

    let head = await LanguageService.getLanguageHead(
      db, 
      languageId,
    )
      

     let totalScore = await LanguageService.getTotalScore(
       db,
       userId
       );
      
      head = head[0];
      totalScore = totalScore[0].total_score
  
      let correctAnswer = head.translation;
      let memoryValue = head.memory_value;
      let wordCorrectCount = head.correct_count;
      let wordIncorrectCount = head.incorrect_count;
      let total_Score = head.total_score;
      let isCorrect = head.isCorrect;
       
      let resObj = {
        answer: head.translation
      }  
    
    /* check answer and fix score */
    if(guess === correctAnswer){  
      resObj.isCorrect = true
      total_Score= totalScore += 1;
      wordCorrectCount += 1;
      memoryValue *= 2;
    } else {
      resObj.isCorrect=false;
      total_Score = totalScore;
      wordIncorrectCount += 1;
      memoryValue= 1;
    }
    /* end check answer and fix score */
   
    let nextHead= head.next;
    let lastWord = head;

    for (let i = 0; i < memoryValue; i++) {
      if (!lastWord.next) {
        break;
      }

    lastWord = await LanguageService.getWordById(
      db,
      lastWord.next
    );
    lastWord = lastWord[0];
  }

    head.next = lastWord.next;
    lastWord.next = head.id;

    await LanguageService.updateWord(
      db,
      head.id,
      {
        memory_value : memoryValue,
        correct_count: wordCorrectCount,
        incorrect_count: wordIncorrectCount,
        next: head.next
      }
    );
    await LanguageService.updateWord(
      db,
      lastWord.id,
      {
        next: head.id,
      }
    )
    await LanguageService.updateLanguage(
      db,
      req.user.id,
      {
        total_score:Number(total_Score),
        head:nextHead
      }
    );

      let newHead = await LanguageService.getLanguageHead(
        db,
        req.user.id
      )
      newHead = newHead[0]

       res.status(200).json({
        nextWord: newHead.original,
        wordCorrectCount: newHead.correct_count,
        wordIncorrectCount: newHead.incorrect_count,
        answer: resObj.answer,
        isCorrect: resObj.isCorrect,
        totalScore: Number(total_Score),
      })
       
       next()
      } catch (error) {
        next(error)
      }
    })

module.exports = languageRouter
