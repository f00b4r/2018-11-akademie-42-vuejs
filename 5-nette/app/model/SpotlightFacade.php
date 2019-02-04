<?php declare(strict_types = 1);

namespace App\Model;

use Nette\Application\LinkGenerator;

final class SpotlightFacade
{

    /** @var LinkGenerator */
    private $linkGenerator;

    public function __construct(LinkGenerator $linkGenerator)
    {
        $this->linkGenerator = $linkGenerator;
    }

    /**
     * @return mixed[]
     */
    public function search(string $query): array
    {
        $items = [];

        $items += $this->searchUsers($query);

        return $items;
    }

    /**
     * @return mixed[]
     */
    private function searchUsers(string $query): array
    {
        $items = [];

        // Lookup in DB, ofc!
        $entities = [
            ['id' => 1, 'fullname' => 'John Doe', 'info' => 'He is so cool!'],
            ['id' => 2, 'fullname' => 'Felix The Cat', 'info' => ''],
        ];

        foreach ($entities as $entity) {
            $items[] = [
                'icon' => 'fa fa-user-circle-o',
                'link' => $this->linkGenerator->link('User:detail', ['id' => $entity['id']]),
                'title' => $entity['fullname'],
                'info' => $entity['info'],
            ];
        }

        return $items;
    }

}
