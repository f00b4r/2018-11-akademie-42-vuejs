<?php declare(strict_types = 1);

namespace App\Model;

use Latte\Compiler;
use Latte\MacroNode;
use Latte\Macros\MacroSet;
use Latte\PhpWriter;
use Nette\InvalidStateException;
use Nette\Utils\FileSystem;
use Nette\Utils\Json;
use Nette\Utils\Strings;

final class WebpackMacro extends MacroSet
{

	/** @var string */
	private $manifest;

	/** @var string|null */
	private $content;

	public function __construct(Compiler $compiler, string $manifest)
	{
		parent::__construct($compiler);
		$this->manifest = $manifest;
	}

	public static function register(Compiler $compiler, string $manifest): void
	{
		$compiler = new static($compiler, $manifest);
		$compiler->addMacro('webpack', NULL, NULL, [$compiler, 'macroWebpack']);
	}

	public function macroWebpack(MacroNode $node, PhpWriter $writer): string
	{
		if (!$node->args) throw new InvalidStateException('n:webpack cannot be empty');

		$asset = trim($writer->write('%node.word'), ' "');
		$type = Strings::endsWith($asset, '.css') ? 'href' : 'src';

		return $writer->write(sprintf('?> %s="%s" <?php', $type, $this->getAsset($asset)));

	}

	private function getAsset(string $asset): ?string
	{
		$content = $this->getContent();

		if (!isset($content[$asset])) {
			throw new InvalidStateException(sprintf('Undefined asset "%s" in manifest "%s"', $asset, $this->manifest));
		}

		return $content[$asset];
	}

	private function getContent(): array
	{
		if (!$this->content) {
			if (file_exists($this->manifest)) {
				$this->content = Json::decode(FileSystem::read($this->manifest), Json::FORCE_ARRAY);
			} else {
				$this->content = [];
			}
		}

		return $this->content;
	}

}
