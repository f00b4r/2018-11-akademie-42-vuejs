<?php declare(strict_types = 1);

namespace App\Presenters;

use App\Model\SpotlightFacade;

class SpotlightPresenter extends BasePresenter
{

    /** @var SpotlightFacade @inject */
    public $spotlightFacade;

    public function actionDefault(): void
    {
        $query = $this->getParameter('q');

        if (empty($query)) {
            $this->sendJson(['items' => []]);
        }

        $this->sendJson(['items' => $this->spotlightFacade->search($query)]);
    }

}
