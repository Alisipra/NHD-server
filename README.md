<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Project Setup Guide</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f9f9f9;
      color: #333;
      padding: 40px;
    }

    .container {
      max-width: 800px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
      color: #0d6efd;
    }

    ol {
      margin-top: 30px;
    }

    li {
      margin-bottom: 20px;
      font-size: 1.1rem;
    }

    code {
      background-color: #eef;
      padding: 4px 8px;
      border-radius: 6px;
      font-family: monospace;
    }

    .tip {
      background-color: #fff3cd;
      border-left: 6px solid #ffc107;
      padding: 10px 20px;
      border-radius: 6px;
      margin-top: 10px;
      font-size: 0.95rem;
    }

    footer {
      margin-top: 40px;
      text-align: center;
      font-size: 0.9rem;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Run This Project on Localhost</h1>
    <ol>
      <li>
        <strong>Step 1:</strong> Download the project as a ZIP file or clone the repository using:<br/>
        <code>git clone https://github.com/your-username/your-repo-name.git</code>
      </li>

      <li>
        <strong>Step 2:</strong> Extract the ZIP (if downloaded), then open your terminal and navigate to the project folder.
      </li>

      <li>
        <strong>Step 3:</strong> Install the required dependencies:<br/>
        <code>npm install</code>
      </li>

      <li>
        <strong>Step 4:</strong> Start the server using:<br/>
        <code>nodemon server.js</code><br/>
        <div class="tip">
          💡 If <code>nodemon</code> is not installed globally, run:<br/>
          <code>npm install -g nodemon</code>
        </div>
      </li>
    </ol>

    <footer>
      &copy; 2025 Your Project Name. All rights reserved.
    </footer>
  </div>
</body>
</html>
