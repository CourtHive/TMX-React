import { isDev } from 'functions/isDev';

export const catchAsync =
  (fn) =>
  (...args) => {
    if (isDev()) {
      return fn(...args);
    } else {
      return fn(...args).catch((err) => console.log(err));
    }
  };
