<?php

namespace App\Doctrine\DQL;

use Doctrine\DBAL\Platforms\SqlitePlatform;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
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
        $parser->match(TokenType::T_OPEN_PARENTHESIS);
        $this->date = $parser->ArithmeticPrimary();
        $parser->match(TokenType::T_CLOSE_PARENTHESIS);
    }
}
