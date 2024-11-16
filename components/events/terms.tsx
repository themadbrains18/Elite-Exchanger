/**
 * Terms Component
 *
 * Displays a list of terms and conditions in an ordered format.
 * Each item in the list represents a rule for the event, detailing
 * requirements for eligibility, referral rewards, and other important guidelines.
 *
 * @returns {JSX.Element} The rendered Terms component
 */
const Terms = () => {

    const rulesList = [
        "Users must invite via the Invite Now button on the event page to be eligible for rewards.",
        "Qualified Referee refers to invited friends who have deposited a minimum of $100 and traded at least $500 within seven (7) days of signing up.",
        "The rewards you receive increase as more friends you invite successfully complete the tasks.",
        "Eligible deposits include One-Click Buy, P2P Trading, Crypto Deposits, and Fiat Deposits. Internal transfer of funds will not be considered for this event.",
        "Only Derivatives trades, Spot trades, and Options trades will be counted toward your trading volume. Spot trading does not include trading pairs with zero fees.",
        "Eligible referees will receive a VIP Trial Card once they achieve the required deposit amount or trading volume.",
        "Rewards from this event can be stacked with rewards from the Crypto Planet Referral Program. Users will continue to receive all referral task rewards as usual.",
        "Rewards from this event cannot be stacked with rewards from the Deposit Blast Off event. Users will continue to receive all referral task rewards as usual. Referees can receive more than two (2) rewards at one time.",
        "The rewards for this event may not be obtained in conjunction with rewards from other ongoing events.",
        "Referral rewards will be automatically distributed to eligible users' Rewards Hub within 14 working days after the event ends. Users will have to manually claim their rewards from the Rewards Hub.",
        "The rewards are distributed on a first-come, first-served basis.",
        "Our risk team will conduct thorough analyses of all referrals. Referrals that do not adhere to our security policy will not be counted toward the reward calculations for this event. Examples include but are not limited to accounts created on the same device, which are treated as existing accounts and therefore not included in reward calculations.",
        "Affiliates are not eligible to participate in this event.",
        "Crypto Planet reserves the right to modify the terms of this event without notifying users in advance.",
        "Crypto Planet reserves the right to the final interpretation of this event. If you have any questions, please contact our Customer Support."
      ];

  return (
    <div className="my-[24px] max-w-[1200px] w-full mx-auto md:px-0 px-[10px]">
      <p className="text-[24px] md:text-[28px] leading-[36px] font-semibold dark:text-white">
        Terms and Conditions
      </p>
      <ol className="by-rules-terms-list by-rules-terms-dark-mode">
      {rulesList.map((rule, index) => (
        <li key={index} className="list-decimal dark:text-[#a6a9b6] text-[14px] leading-[22px] list-inside mt-[16px] pl-[10px] md:pl-[30px]" >
          {rule}
        </li>
      ))}
    </ol>
    </div>
  );
};

export default Terms;
