/*!
 * Copyright (c) https://github.com/lutinglt
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { cssCombine } from "@lutinglt/gitea-github-theme/core";
import issue from "./issue";
import issueComment from "./issue_comment";
import issueConversation from "./issue_conversation";
import issueList from "./issue_list";
import issueOverview from "./issue_overview";
import issueSidebar from "./issue_sidebar";
import issueTimeline from "./issue_timeline";
import pullList from "./pull_list";
import pullReview from "./pull_review";

export default cssCombine(
  issue,
  issueComment,
  issueList,
  issueOverview,
  pullList,
  issueConversation,
  pullReview,
  issueSidebar,
  issueTimeline
);
