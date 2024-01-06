import express from 'express';
import app from './app';
import config from './config'


app.listen(config.port, () => {
    console.info(`Server running on port ${config.port}`);
});