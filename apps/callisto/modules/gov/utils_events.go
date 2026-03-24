package gov

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	sdk "github.com/cosmos/cosmos-sdk/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
	govtypesv1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"

	eventsutil "github.com/forbole/callisto/v4/utils/events"
)

// ProposalIDFromEvent returns the proposal id from the given events
func ProposalIDFromEvents(events sdk.StringEvents) (uint64, error) {
	for _, event := range events {
		attribute, ok := eventsutil.FindAttributeByKey(event, govtypes.AttributeKeyProposalID)
		if ok {
			return strconv.ParseUint(attribute.Value, 10, 64)
		}
	}

	return 0, fmt.Errorf("no proposal id found")
}

// WeightVoteOptionsFromEvents returns the vote option from the given events
func WeightVoteOptionsFromEvents(events sdk.StringEvents) ([]govtypesv1.WeightedVoteOption, error) {
	for _, event := range events {
		attribute, ok := eventsutil.FindAttributeByKey(event, govtypes.AttributeKeyOption)
		if ok {
			return parseWeightVoteOptions(attribute.Value)
		}
	}

	return []govtypesv1.WeightedVoteOption{}, fmt.Errorf("no vote option found")
}

// parseWeightVoteOptions returns the vote option from the given string
// option value in string has 2 cases, for example:
// 1. "{\"option\":1,\"weight\":\"1.000000000000000000\"}"
// 2. "option:VOTE_OPTION_NO weight:\"1.000000000000000000\""
// 3. "[{\"option\":1,\"weight\":\"1.000000000000000000\"}]"
func parseWeightVoteOptions(optionValue string) ([]govtypesv1.WeightedVoteOption, error) {
	// try parse json 1 option value
	var weightedVoteOption govtypesv1.WeightedVoteOption
	err := json.Unmarshal([]byte(optionValue), &weightedVoteOption)
	if err == nil {
		return []govtypesv1.WeightedVoteOption{weightedVoteOption}, nil
	}

	// try parse json 3 option value
	var weightedVoteOptions []govtypesv1.WeightedVoteOption
	err = json.Unmarshal([]byte(optionValue), &weightedVoteOptions)
	if err == nil {
		return weightedVoteOptions, nil
	}

	// try parse string option value
	// option:VOTE_OPTION_NO weight:"1.000000000000000000"
	voteOptionParsed := strings.Split(optionValue, " ")
	if len(voteOptionParsed) != 2 {
		return []govtypesv1.WeightedVoteOption{}, fmt.Errorf("failed to parse vote option %s", optionValue)
	}

	voteOption, err := govtypesv1.VoteOptionFromString(strings.ReplaceAll(voteOptionParsed[0], "option:", ""))
	if err != nil {
		return []govtypesv1.WeightedVoteOption{}, fmt.Errorf("failed to parse vote option %s: %s", optionValue, err)
	}
	weight := strings.ReplaceAll(voteOptionParsed[1], "weight:", "")
	weight = strings.ReplaceAll(weight, "\"", "")

	return []govtypesv1.WeightedVoteOption{{Option: voteOption, Weight: weight}}, nil
}
