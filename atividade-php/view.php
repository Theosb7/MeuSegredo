<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Matrícula</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 480px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        h1 {
            color: #fff;
            text-align: center;
            margin-bottom: 8px;
            font-size: 1.8rem;
            font-weight: 700;
        }

        .subtitle {
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
            font-size: 0.9rem;
            margin-bottom: 32px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input[type="text"],
        input[type="number"],
        select {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
            outline: none;
        }

        input:focus,
        select:focus {
            border-color: #7c5cbf;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 0 3px rgba(124, 92, 191, 0.2);
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            padding-right: 40px;
        }

        select option {
            background: #1a1a2e;
            color: #fff;
        }

        .btn-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #7c5cbf, #a855f7);
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(124, 92, 191, 0.4);
        }

        .btn-submit:active {
            transform: translateY(0);
        }

        /* Mensagens de feedback */
        .alert {
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 0.95rem;
            line-height: 1.6;
            color: #fff;
        }

        .alert-sucesso {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .alert-erro {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .alert-aviso {
            background: rgba(250, 204, 21, 0.15);
            border: 1px solid rgba(250, 204, 21, 0.3);
        }

        .voltar-link {
            display: block;
            text-align: center;
            margin-top: 16px;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            font-size: 0.85rem;
            transition: color 0.3s;
        }

        .voltar-link:hover {
            color: #a855f7;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 Matrícula</h1>
        <p class="subtitle">Sistema de Cadastro de Alunos</p>

        <?php if (isset($mensagem) && isset($tipo)): ?>
            <div class="alert alert-<?= htmlspecialchars($tipo) ?>">
                <?= $mensagem ?>
            </div>
            <a href="/" class="voltar-link">← Fazer nova matrícula</a>
        <?php else: ?>
            <!-- Formulário enviando via POST para a raiz do servidor -->
            <form method="POST" action="/">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite o nome completo">
                </div>

                <div class="form-group">
                    <label for="idade">Idade</label>
                    <input type="number" id="idade" name="idade" placeholder="Ex: 20" min="1" max="120">
                </div>

                <div class="form-group">
                    <label for="curso">Curso</label>
                    <select id="curso" name="curso">
                        <option value="">Selecione um curso...</option>
                        <option value="Engenharia">Engenharia</option>
                        <option value="Medicina">Medicina</option>
                        <option value="Direito">Direito</option>
                        <option value="Administração">Administração</option>
                        <option value="Ciência da Computação">Ciência da Computação</option>
                    </select>
                </div>

                <button type="submit" class="btn-submit">Matricular Aluno</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
