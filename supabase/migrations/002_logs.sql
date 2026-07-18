-- 操作日志表（记录所有配置变更）
create table if not exists public.config_change_logs (
  id uuid default uuid_generate_v4() primary key,
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_value jsonb,
  new_value jsonb,
  changed_by uuid references public.users,
  changed_at timestamptz default now(),
  ip_address text,
  user_agent text
);

-- RLS
alter table public.config_change_logs enable row level security;

create policy "Admins can view logs"
  on public.config_change_logs for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "System can create logs"
  on public.config_change_logs for insert
  with check (true);

-- 触发器：自动记录 operation_configs 变更
create or replace function public.log_config_changes()
returns trigger as $$
begin
  if (tg_op = 'UPDATE') then
    insert into public.config_change_logs (table_name, record_id, action, old_value, new_value, changed_by)
    values ('operation_configs', old.id, 'UPDATE', row_to_json(old), row_to_json(new), auth.uid());
    return new;
  elsif (tg_op = 'INSERT') then
    insert into public.config_change_logs (table_name, record_id, action, new_value, changed_by)
    values ('operation_configs', new.id, 'INSERT', row_to_json(new), auth.uid());
    return new;
  elsif (tg_op = 'DELETE') then
    insert into public.config_change_logs (table_name, record_id, action, old_value, changed_by)
    values ('operation_configs', old.id, 'DELETE', row_to_json(old), auth.uid());
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create or replace trigger on_config_change
  after insert or update or delete on public.operation_configs
  for each row execute procedure public.log_config_changes();
