import StoryblokClient from 'storyblok-js-client';

const Storyblok = new StoryblokClient({
  accessToken: 'LylmZFRCZKItDS4TcaFwkwtt', 
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

export default Storyblok;
