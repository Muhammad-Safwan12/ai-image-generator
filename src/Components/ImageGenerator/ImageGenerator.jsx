import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const ImageGenerator = () => {
  const [image_url, setImageUrl] = useState('/');
  const [loading, setloading] = useState(false);
  let inputRef = useRef(null);

  const imageGenerator = async () => {
    if (inputRef.current.value === '') {
      return;
    }
    setloading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'User-Agent': 'Chrome',
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
          n: 1,
          size: '512x512',
        }),
      });

      let data = await response.json();
      let data_array = data.data;
      setImageUrl(data_array[0].url);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img src={image_url === '/' ? default_image : image_url} alt="" />
        </div>
        <div className="loading">
          <div className={loading ? 'loading-bar-full' : 'loading-bar'}></div>
          <div className={loading ? 'loading-text' : 'display:none'}>Loading....</div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
