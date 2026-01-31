<?php

namespace Ari\Doctrine\DQL;

use Doctrine\Common\Lexer\Token;
use Doctrine\DBAL\Platforms\SqlitePlatform;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\TokenType;

class Day extends FunctionNode
{
    public mixed $date;

    #[\Override]
    public function getSql(SqlWalker $sqlWalker): string
    {
        $platform = $sqlWalker->getConnection()->getDatabasePlatform();
        $date = $sqlWalker->walkArithmeticPrimary($this->date);

        if ($platform instanceof SqlitePlatform) {
            return 'CAST(strftime(\'%d\', ' . $date . ') AS INTEGER)';
        }

        return 'DAY(' . $date . ')';
    }

    #[\Override]
    public function parse(Parser $parser): void
    {
        $lexer = $parser->getLexer();
        $token = $lexer->lookahead;
        if ($token instanceof Token && is_string($token->value) && 0 === strcasecmp($token->value, 'DAY')) {
            $parser->match(TokenType::T_IDENTIFIER);
        }

        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->date = $parser->ArithmeticPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }
}
