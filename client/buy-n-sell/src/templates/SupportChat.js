import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Alert,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const SupportChat = () => {
  const [messages, setMessages] = useState([{ role: 'bot', content: `Hello I'm Buy & Sell Assistant , I'm hear to help you !!`}]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const chatEndRef = useRef(null);
  const theme = useTheme();
  const abortControllerRef = useRef(null);
  console.log(process.env.LLM_URI)
  useEffect(() => {
    // scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const callOllama = async (userMessage, signal) => {
    const systemPrompt = `<|system|>"You are an AI assistant designed to guide users in navigating the Buy-Sell @ IIITH website. Your responses should be clear, concise, and user-friendly, helping users understand how to efficiently use the platform's features. Provide step-by-step guidance on how to buy, sell, and manage items. Explain the website's navigation, including key pages and functionalities, the navigation bar will contain 1.Profile (you can change your profile) 2.Shop (to go to the shop) 3.Order History(to check old orders and purchased order's OTP) 4. Delivery (For sellers to close the transaction by entering buyer's OTP) 5. Sell (To sell a new product) 6. Support (a chat-application to talk to) . Assist users with common issues, such as login, item search, order tracking, and transaction completion. Ensure responses are context-aware based on the user's current action or query. New users must register with an IIIT email, and logged-in users can access all features without repeated logins. The navbar contains links to all major sections, and users can view and update their profile from the dashboard. Users can search for items using the search bar (only in the shop) in the /shop part of the website and filter them by category. Clicking on an item opens its details page, with an option to add to cart. Purchases are finalized in the My Cart section. Users Sell items in the Sell page with details like name, price, and category. The Deliver Items page shows pending orders, requiring OTP verification from buyers to complete transactions. The Orders History page tracks all past purchases and sales, allowing users to check pending transactions and verify orders via OTP. For link of the website it's http://127.0.0.1:3000 and endpoints are http://127.0.0.1:3000/profile for profile  http://127.0.0.1:3000/shop for shop http://127.0.0.1:3000/history for order history http://127.0.0.1:3000/delivery for delivery http://127.0.0.1:3000/cart for the cart http://127.0.0.1:3000/sell for selling item http://127.0.0.1:3000/support for support. Users can access the Support page for instant help, where the chatbot provides context-aware assistance based on user queries. Maintain a friendly and helpful tone, keep explanations short and action-oriented, provide step-by-step troubleshooting when needed, and ensure a smooth user experience by making navigation intuitive and frustration-free, for irrelevent ask the user to ask something relevent to the website."  
</s>`;
    const userPrompt = `<|user|>${userMessage}</s>`;
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gemma2:2b",
        prompt: systemPrompt + '\n' + userPrompt,
        stream: true,
        options: {
          temperature: 0.7,
          top_k: 50,
          top_p: 0.95,
          max_tokens: 1000,
          stop: ["</s>", "<|user|>", "<|system|>"]
        }
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const json = JSON.parse(line);
            if (json.response) {
              accumulatedResponse += json.response;
              setCurrentStreamingMessage(accumulatedResponse);
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw error;
    }

    return accumulatedResponse;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentStreamingMessage('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await callOllama(userMessage, abortControllerRef.current.signal);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      if (error.message !== 'Request was cancelled') {
        setError('Failed to connect to Ollama. Please ensure the service is running locally.');
        console.error('Error:', error);
      }
    } finally {
      setIsLoading(false);
      setCurrentStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  return (
    <Box sx={{
      backgroundColor: "background.default",
      minHeight: "100vh",
      py: 4,
    }}>
      <Container maxWidth="lg">
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        <Paper 
          elevation={3}
          sx={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.primary.main,
            color: 'white',
          }}>
            <Typography variant="h6">
              Support Assistant
            </Typography>
          </Box>

          <Box sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: theme.palette.grey[50],
          }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  mb: 2,
                  gap: 1,
                }}
              >
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: msg.role === 'user' ? theme.palette.primary.main : theme.palette.grey[300],
                  color: msg.role === 'user' ? 'white' : theme.palette.grey[700],
                }}>
                  {msg.role === 'user' ? <PersonOutlineIcon /> : <SmartToyOutlinedIcon />}
                </Box>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.role === 'user' ? theme.palette.primary.main : 'white',
                    color: msg.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" >
                  {msg.role === 'user' &&
                    msg.content
                  }
                  {msg.role !== 'user' &&
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                  }

                  </Typography>
                </Paper>
              </Box>
            ))}
            
            {/* Streaming message */}
            {currentStreamingMessage && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  mb: 2,
                  gap: 1,
                }}
              >
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.grey[700],
                }}>
                  <SmartToyOutlinedIcon />
                </Box>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: 'white',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" >
                  <ReactMarkdown>
                    {currentStreamingMessage}
                  </ReactMarkdown>
                  </Typography>
                </Paper>
              </Box>
            )}
            
            <div ref={chatEndRef} />
          </Box>

          <Box sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <IconButton 
                color="primary"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{
                  alignSelf: 'flex-end',
                  p: '8px',
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SupportChat;