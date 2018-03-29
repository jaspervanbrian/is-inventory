<?php

session_start();

require_once '../../Database/Connection.php';
require_once '../../Models/Issue.php';

use App\Models\Issue;

$stocks = new Issue();

echo $stocks->getIssuesPages();
