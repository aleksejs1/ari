<?php

namespace App\Doctrine\DQL;

use Doctrine\Common\Lexer\Token;
use Doctrine\DBAL\Platforms\SqlitePlatform;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\TokenType;

class Month extends FunctionNode
{
    public mixed $date;

    #[\Override]
    public function getSql(SqlWalker $sqlWalker): string
    {
        $platform = $sqlWalker->getConnection()->getDatabasePlatform();
        $date = $sqlWalker->walkArithmeticPrimary($this->date);

        if ($platform instanceof SqlitePlatform) {
            return 'CAST(strftime(\'%m\', ' . $date . ') AS INTEGER)';
        }

        return 'MONTH(' . $date . ')';
    }

    #[\Override]
    public function parse(Parser $parser): void
    {
        $lexer = $parser->getLexer();
        $token = $lexer->lookahead;
        if ($token instanceof Token && is_string($token->value) && 0 === strcasecmp($token->value, 'MONTH')) {
            $parser->match(TokenType::T_IDENTIFIER);
        }

        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->date = $parser->ArithmeticPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }
}
