$(function() {
 

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  
  var $currentInput = $usernameInput.focus();

  var socket = io();

 


  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

   
    if (username) {
      $loginPage.hide();
      $chatPage.show();
      
      $currentInput = $inputMessage.focus();

      
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
   
    message = cleanInput(message);
    
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
     
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data) {
  

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username+':');
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

   
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv);
  }


 

 
  function addMessageElement (el) {
    var $el = $(el);
    $messages.append($el);
    
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

 
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

 


  $window.keydown(function (event) {
   
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });



  
  $loginPage.click(function () {
    $currentInput.focus();
  });

  
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  
  socket.on('login', function (data) {
    connected = true;
    
  });

 
  socket.on('new message', function (data) {
    addChatMessage(data);
  });



});