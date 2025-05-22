import styled from 'styled-components';

// Styled components
const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: #2c3e50;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Article = styled.article`
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ArticleTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 3px;
  }
`;

const ArticleExcerpt = styled.p`
  color: #7f8c8d;
  line-height: 1.7;
  font-size: 1.05rem;
`;

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Top 5 Gadgets to Watch in 2025',
      excerpt: 'Explore the latest trends and innovations shaping the future of tech and lifestyle.',
      date: 'May 22, 2025',
      readTime: '5 min read',
      category: 'Technology'
    },
    {
      id: 2,
      title: 'Style Tips for the Modern Professional',
      excerpt: 'Fashion meets functionality. Discover top looks for your next meeting or weekend getaway.',
      date: 'May 15, 2025',
      readTime: '4 min read',
      category: 'Fashion'
    }
  ];

  return (
    <BlogContainer>
      <PageTitle>VMK Blog</PageTitle>
      {blogPosts.map(post => (
        <Article key={post.id}>
          <ArticleTitle>{post.title}</ArticleTitle>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1rem',
            fontSize: '0.9rem',
            color: '#7f8c8d'
          }}>
            <span style={{ 
              backgroundColor: '#f0f7ff', 
              color: '#3498db', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '20px',
              fontWeight: '500',
              marginRight: '1rem'
            }}>
              {post.category}
            </span>
            <span style={{ marginRight: '1rem' }}>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <ArticleExcerpt>{post.excerpt}</ArticleExcerpt>
        </Article>
      ))}
    </BlogContainer>
  );
};

export default Blog;
