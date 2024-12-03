const LoginPage = async () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-white p-16">
      <h1>Login Page</h1>
      <form method="POST" action="/api/login">
        <div>
          <label htmlFor="identifier">이메일</label>
          <input
            className="border p-8"
            id="identifier"
            name="identifier"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            className="border p-8"
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
